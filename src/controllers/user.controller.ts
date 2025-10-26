import { Request, Response } from "express";
import { User, IUser } from "../models/userModel";
import { Types } from "mongoose";
import { userCreatedEvent } from "../services/rabbitServiceEvent";
import bcrypt from "bcryptjs";
import { RoleType, IRole } from "../models/roleModel";
import { cache } from "../utils/cache";

// Create a new user
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    let { name, email, password, role, colony, domicilio } = req.body;

    // Parse role if it's a string (from multipart/form-data)
    if (typeof role === "string") {
      try {
        // Fix malformed JSON
        const fixedRole = role
          .replace(/\{(\w+):/g, '{"$1":')
          .replace(/:(\w+)\}/g, ':"$1"}');
        role = JSON.parse(fixedRole);
      } catch {
        res.status(400).json({
          message: "Invalid role format. Expected format: [{\"type\":\"admin\"}]",
          received: role,
        });
        return;
      }
    }

    if (!name || !email || !password || !role || !Array.isArray(role)) {
      res
        .status(400)
        .json({ message: "All required fields must be provided and role must be an array" });
      return;
    }

    if (!req.biometricVerification) {
      res.status(403).json({
        message: "Se requiere verificación biométrica para registrar un nuevo usuario",
        requiresBiometric: true,
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: "Invalid email format" });
      return;
    }

    for (const r of role) {
      if (!Object.values(RoleType).includes(r.type)) {
        res.status(400).json({ message: `Invalid role type: ${r.type}` });
        return;
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User with this email already exists" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const generateAccountNumber = (): string =>
      Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();

    const generateBalance = (): number =>
      Math.floor(Math.random() * (100000 - 50000 + 1)) + 50000;

    const generateAlias = (userName: string): string => {
      const cleanName = userName.trim().split(" ")[0].toLowerCase();
      const randomNum = Math.floor(Math.random() * 9999);
      return `${cleanName}${randomNum}`;
    };

    const user: IUser = await User.create({
      name,
      email,
      password: passwordHash,
      role,
      colony: colony || undefined,
      domicilio: domicilio || undefined,
      banorteAccount: {
        number: generateAccountNumber(),
        alias: generateAlias(name),
        linked: true,
        balance: generateBalance(),
      },
      status: true,
    });

    await userCreatedEvent({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role.map((r: IRole) => r.type).join(","),
      creationDate: new Date(),
    });

    res.status(201).json({
      message: "User created successfully",
      biometricVerification: req.biometricVerification,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        colony: user.colony,
        domicilio: user.domicilio,
        banorteAccount: {
          number: user.banorteAccount?.number,
          alias: user.banorteAccount?.alias,
          balance: user.banorteAccount?.balance,
          linked: user.banorteAccount?.linked,
        },
        savedProjects: user.savedProjects,
        votedProjects: user.votedProjects,
        proposedProjects: user.proposedProjects,
        impactSummary: user.impactSummary,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "An error occurred while creating user",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get all users
export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      message: "Users retrieved successfully",
      users,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "An error occurred while getting all users",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    const user = await User.findById(id).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      message: "User retrieved successfully",
      user,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "An error occurred while getting user by ID",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      role,
      status,
      colony,
      domicilio,
      savedProjects,
      votedProjects,
      proposedProjects,
      impactSummary,
    }: Partial<IUser> = req.body;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (role) {
      if (!Array.isArray(role)) {
        res.status(400).json({ message: "Role must be an array" });
        return;
      }

      for (const r of role) {
        if (!Object.values(RoleType).includes(r.type)) {
          res.status(400).json({ message: `Invalid role type: ${r.type}` });
          return;
        }
      }

      user.role = role;
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (typeof status === "boolean") user.status = status;
    if (colony) user.colony = colony;
    if (domicilio) user.domicilio = domicilio;
    if (savedProjects) user.savedProjects = savedProjects;
    if (votedProjects) user.votedProjects = votedProjects;
    if (proposedProjects) user.proposedProjects = proposedProjects;
    if (impactSummary) user.impactSummary = impactSummary;

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "An error occurred while updating user",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.status = false;
    user.deleteDate = new Date();
    await user.save();

    res.status(200).json({
      message: "User logically deleted successfully",
      user,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "An error occurred while deleting user",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get admins
export const getAdmins = async (_req: Request, res: Response): Promise<void> => {
  try {
    const admins = await User.find(
      { role: { $elemMatch: { type: RoleType.ADMIN } } },
      "email name"
    );
    res.status(200).json(admins);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error fetching admin users" });
  }
};

// Get user devices
export const getUserDevices = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    const user = await User.findById(id).select("devices");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      message: "Devices retrieved successfully",
      devices: user.devices,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "An error occurred while getting user devices",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Logout from one device
export const logoutDevice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { deviceId } = req.body;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    if (!deviceId) {
      res.status(400).json({ message: "Device ID is required" });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const deviceIndex = user.devices.findIndex((d) => d.deviceId === deviceId);
    if (deviceIndex === -1) {
      res.status(404).json({ message: "Device not found" });
      return;
    }

    user.devices.splice(deviceIndex, 1);
    await user.save();

    cache.del(id);

    res.status(200).json({
      message: "Device logged out successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "An error occurred while logging out device",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Logout all devices
export const logoutAllDevices = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.devices = [];
    await user.save();

    cache.del(id);

    res.status(200).json({
      message: "All devices logged out successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "An error occurred while logging out all devices",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
