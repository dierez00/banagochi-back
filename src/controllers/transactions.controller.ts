import { Request, Response } from "express";
import { Transaction, ITransaction } from "../models/transactions.model";
import { Aside } from "../models/aside.model";
import { Types } from "mongoose";

// Crear una transacción única (aportación one-time)
export const createOneTimeTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, projectId, amount } = req.body;

    if (!userId || !projectId || !amount) {
      res.status(400).json({ message: "userId, projectId y amount son requeridos" });
      return;
    }

    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(projectId)) {
      res.status(400).json({ message: "IDs inválidos" });
      return;
    }

    if (amount <= 0) {
      res.status(400).json({ message: "El monto debe ser mayor a 0" });
      return;
    }

    const transaction: ITransaction = await Transaction.create({
      userId: new Types.ObjectId(userId),
      projectId: new Types.ObjectId(projectId),
      amount,
      source: "ONE_TIME",
      status: "pending",
    });

    // TODO: Aquí iría la integración con la API de Banorte para procesar el pago
    // Por ahora simulamos que se completa exitosamente
    transaction.status = "completed";
    transaction.updatedAt = new Date();
    await transaction.save();

    res.status(201).json({
      message: "Transacción creada exitosamente",
      transaction: {
        id: transaction._id,
        userId: transaction.userId,
        projectId: transaction.projectId,
        amount: transaction.amount,
        source: transaction.source,
        status: transaction.status,
        createdAt: transaction.createdAt,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Error al crear la transacción",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Procesar apartados recurrentes (ejecutado por un cron job)
export const processPayrollDeductions = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Obtener todos los apartados activos
    const activeAsides = await Aside.find({ status: "ACTIVE" });

    const results = {
      processed: 0,
      failed: 0,
      total: activeAsides.length,
    };

    for (const aside of activeAsides) {
      try {
        // Crear transacción por cada apartado activo
        const transaction = await Transaction.create({
          userId: aside.userId,
          projectId: aside.projectId,
          amount: aside.amountPerCycle,
          source: "PAYROLL_DEDUCTION",
          apartadoId: aside._id,
          status: "pending",
        });

        // TODO: Integración con API de Banorte para descuento de nómina
        // Por ahora simulamos éxito
        transaction.status = "completed";
        transaction.updatedAt = new Date();
        await transaction.save();

        // Actualizar total contribuido
        aside.totalContributed += aside.amountPerCycle;
        aside.updatedAt = new Date();
        await aside.save();

        results.processed++;
      } catch (error) {
        console.error(`Error procesando apartado ${aside._id}:`, error);
        results.failed++;
      }
    }

    res.status(200).json({
      message: "Procesamiento de apartados completado",
      results,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Error al procesar apartados",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Obtener transacciones de un usuario
export const getUserTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { status, projectId, source } = req.query;

    if (!Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: "userId inválido" });
      return;
    }

    const filter: any = { 
      userId: new Types.ObjectId(userId),
      deletedAt: { $exists: false },
    };

    if (status) filter.status = status;
    if (projectId) filter.projectId = new Types.ObjectId(projectId as string);
    if (source) filter.source = source;

    const transactions = await Transaction.find(filter)
      .populate("projectId", "title category")
      .sort({ createdAt: -1 });

    const summary = {
      total: transactions.length,
      totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
      byStatus: {
        completed: transactions.filter(t => t.status === "completed").length,
        pending: transactions.filter(t => t.status === "pending").length,
        failed: transactions.filter(t => t.status === "failed").length,
      },
      bySource: {
        oneTime: transactions.filter(t => t.source === "ONE_TIME").length,
        payroll: transactions.filter(t => t.source === "PAYROLL_DEDUCTION").length,
      },
    };

    res.status(200).json({
      message: "Transacciones obtenidas exitosamente",
      summary,
      transactions,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Error al obtener transacciones",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Obtener transacciones de un proyecto
export const getProjectTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;

    if (!Types.ObjectId.isValid(projectId)) {
      res.status(400).json({ message: "projectId inválido" });
      return;
    }

    const transactions = await Transaction.find({
      projectId: new Types.ObjectId(projectId),
      status: "completed",
      deletedAt: { $exists: false },
    })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    const totalRaised = transactions.reduce((sum, t) => sum + t.amount, 0);
    const contributors = new Set(transactions.map(t => t.userId.toString())).size;

    res.status(200).json({
      message: "Transacciones del proyecto obtenidas",
      summary: {
        totalRaised,
        totalTransactions: transactions.length,
        uniqueContributors: contributors,
      },
      transactions,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Error al obtener transacciones del proyecto",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Dashboard de impacto - Resumen financiero del usuario
export const getUserImpactDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: "userId inválido" });
      return;
    }

    // Obtener todas las transacciones completadas
    const completedTransactions = await Transaction.find({
      userId: new Types.ObjectId(userId),
      status: "completed",
      deletedAt: { $exists: false },
    }).populate("projectId", "title category status");

    // Obtener apartados activos
    const activeAsides = await Aside.find({
      userId: new Types.ObjectId(userId),
      status: "ACTIVE",
    }).populate("projectId", "title category");

    // Calcular métricas
    const totalContributed = completedTransactions.reduce((sum, t) => sum + t.amount, 0);
    const projectsSupported = new Set(completedTransactions.map(t => t.projectId._id.toString())).size;
    
    const monthlyCommitment = activeAsides.reduce((sum, a) => {
      const multiplier = a.frequency === "WEEKLY" ? 4 : a.frequency === "BIWEEKLY" ? 2 : 1;
      return sum + (a.amountPerCycle * multiplier);
    }, 0);

    // Agrupar por categoría
    const byCategory: { [key: string]: number } = {};
    completedTransactions.forEach(t => {
      const category = (t.projectId as any).category || "Otros";
      byCategory[category] = (byCategory[category] || 0) + t.amount;
    });

    res.status(200).json({
      message: "Dashboard de impacto obtenido",
      dashboard: {
        totalContributed,
        projectsSupported,
        activeAsides: activeAsides.length,
        monthlyCommitment,
        byCategory,
        recentTransactions: completedTransactions.slice(0, 5),
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Error al obtener dashboard",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};