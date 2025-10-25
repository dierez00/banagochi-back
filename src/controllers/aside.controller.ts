import { Request, Response } from "express";
import { Aside, IAside } from "../models/aside.model";
import { Types } from "mongoose";

// Crear un apartado de nómina (recurrente)
export const createPayrollAside = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, projectId, amountPerCycle, frequency } = req.body;

    if (!userId || !projectId || !amountPerCycle || !frequency) {
      res.status(400).json({ 
        message: "userId, projectId, amountPerCycle y frequency son requeridos" 
      });
      return;
    }

    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(projectId)) {
      res.status(400).json({ message: "IDs inválidos" });
      return;
    }

    if (!["WEEKLY", "BIWEEKLY", "MONTHLY"].includes(frequency)) {
      res.status(400).json({ 
        message: "Frecuencia inválida. Use: WEEKLY, BIWEEKLY o MONTHLY" 
      });
      return;
    }

    if (amountPerCycle <= 0) {
      res.status(400).json({ message: "El monto por ciclo debe ser mayor a 0" });
      return;
    }

    const aside = await Aside.create({
      userId: new Types.ObjectId(userId),
      projectId: new Types.ObjectId(projectId),
      amountPerCycle,
      frequency,
      status: "ACTIVE",
      totalContributed: 0,
    });

    res.status(201).json({
      message: "Apartado de nómina creado exitosamente",
      aside: {
        id: aside._id,
        userId: aside.userId,
        projectId: aside.projectId,
        amountPerCycle: aside.amountPerCycle,
        frequency: aside.frequency,
        status: aside.status,
        totalContributed: aside.totalContributed,
        createdAt: aside.createdAt,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Error al crear el apartado",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Obtener apartados de un usuario
export const getUserAsides = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { status } = req.query;

    if (!Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: "userId inválido" });
      return;
    }

    const filter: any = { 
      userId: new Types.ObjectId(userId) 
    };

    if (status) {
      filter.status = status;
    }

    const asides = await Aside.find(filter)
      .populate("projectId", "title category status");

    const summary = {
      total: asides.length,
      active: asides.filter(a => a.status === "ACTIVE").length,
      paused: asides.filter(a => a.status === "PAUSED").length,
      cancelled: asides.filter(a => a.status === "CANCELLED").length,
      totalContributed: asides.reduce((sum, a) => sum + a.totalContributed, 0),
      monthlyCommitment: asides
        .filter(a => a.status === "ACTIVE")
        .reduce((sum, a) => {
          const multiplier = a.frequency === "WEEKLY" ? 4 : a.frequency === "BIWEEKLY" ? 2 : 1;
          return sum + (a.amountPerCycle * multiplier);
        }, 0),
    };

    res.status(200).json({
      message: "Apartados obtenidos exitosamente",
      summary,
      asides,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Error al obtener apartados",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Obtener un apartado por ID
export const getAsideById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { asideId } = req.params;

    if (!Types.ObjectId.isValid(asideId)) {
      res.status(400).json({ message: "asideId inválido" });
      return;
    }

    const aside = await Aside.findById(asideId)
      .populate("userId", "name email")
      .populate("projectId", "title category status");

    if (!aside) {
      res.status(404).json({ message: "Apartado no encontrado" });
      return;
    }

    res.status(200).json({
      message: "Apartado obtenido exitosamente",
      aside,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Error al obtener el apartado",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Obtener apartados de un proyecto
export const getProjectAsides = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;

    if (!Types.ObjectId.isValid(projectId)) {
      res.status(400).json({ message: "projectId inválido" });
      return;
    }

    const asides = await Aside.find({
      projectId: new Types.ObjectId(projectId),
      status: "ACTIVE",
    }).populate("userId", "name email");

    const totalRecurringCommitment = asides.reduce((sum, a) => {
      const multiplier = a.frequency === "WEEKLY" ? 4 : a.frequency === "BIWEEKLY" ? 2 : 1;
      return sum + (a.amountPerCycle * multiplier);
    }, 0);

    res.status(200).json({
      message: "Apartados del proyecto obtenidos",
      summary: {
        totalAsides: asides.length,
        totalRecurringCommitment,
        totalContributed: asides.reduce((sum, a) => sum + a.totalContributed, 0),
      },
      asides,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Error al obtener apartados del proyecto",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Pausar un apartado
export const pauseAside = async (req: Request, res: Response): Promise<void> => {
  try {
    const { asideId } = req.params;

    if (!Types.ObjectId.isValid(asideId)) {
      res.status(400).json({ message: "asideId inválido" });
      return;
    }

    const aside = await Aside.findById(asideId);
    if (!aside) {
      res.status(404).json({ message: "Apartado no encontrado" });
      return;
    }

    if (aside.status !== "ACTIVE") {
      res.status(400).json({ message: "Solo se pueden pausar apartados activos" });
      return;
    }

    aside.status = "PAUSED";
    aside.updatedAt = new Date();
    await aside.save();

    res.status(200).json({
      message: "Apartado pausado exitosamente",
      aside,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Error al pausar apartado",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Reactivar un apartado
export const reactivateAside = async (req: Request, res: Response): Promise<void> => {
  try {
    const { asideId } = req.params;

    if (!Types.ObjectId.isValid(asideId)) {
      res.status(400).json({ message: "asideId inválido" });
      return;
    }

    const aside = await Aside.findById(asideId);
    if (!aside) {
      res.status(404).json({ message: "Apartado no encontrado" });
      return;
    }

    if (aside.status !== "PAUSED") {
      res.status(400).json({ message: "Solo se pueden reactivar apartados pausados" });
      return;
    }

    aside.status = "ACTIVE";
    aside.updatedAt = new Date();
    await aside.save();

    res.status(200).json({
      message: "Apartado reactivado exitosamente",
      aside,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Error al reactivar apartado",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Cancelar un apartado
export const cancelAside = async (req: Request, res: Response): Promise<void> => {
  try {
    const { asideId } = req.params;

    if (!Types.ObjectId.isValid(asideId)) {
      res.status(400).json({ message: "asideId inválido" });
      return;
    }

    const aside = await Aside.findById(asideId);
    if (!aside) {
      res.status(404).json({ message: "Apartado no encontrado" });
      return;
    }

    if (aside.status === "CANCELLED") {
      res.status(400).json({ message: "El apartado ya está cancelado" });
      return;
    }

    aside.status = "CANCELLED";
    aside.updatedAt = new Date();
    await aside.save();

    res.status(200).json({
      message: "Apartado cancelado exitosamente",
      aside,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Error al cancelar apartado",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Actualizar monto de un apartado
export const updateAsideAmount = async (req: Request, res: Response): Promise<void> => {
  try {
    const { asideId } = req.params;
    const { amountPerCycle } = req.body;

    if (!Types.ObjectId.isValid(asideId)) {
      res.status(400).json({ message: "asideId inválido" });
      return;
    }

    if (!amountPerCycle || amountPerCycle <= 0) {
      res.status(400).json({ message: "El monto debe ser mayor a 0" });
      return;
    }

    const aside = await Aside.findById(asideId);
    if (!aside) {
      res.status(404).json({ message: "Apartado no encontrado" });
      return;
    }

    if (aside.status === "CANCELLED") {
      res.status(400).json({ message: "No se puede modificar un apartado cancelado" });
      return;
    }

    aside.amountPerCycle = amountPerCycle;
    aside.updatedAt = new Date();
    await aside.save();

    res.status(200).json({
      message: "Monto del apartado actualizado exitosamente",
      aside,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Error al actualizar monto del apartado",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};