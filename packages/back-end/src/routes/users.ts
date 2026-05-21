import { Router } from 'express';
import IRoute from '../types/IRoute';
import { User } from '../services/db';
import { Op, Order } from "sequelize";
import { userSchema } from "../shared/userSchema";

const UsersRouter: IRoute = {
  route: '/users',
  router() {
    const router = Router();

    // ---------------- GET USERS ----------------
    router.get("/", async (req, res) => {
      try {
        const page = typeof req.query.page === "string" ? req.query.page : "1";
        const limit = typeof req.query.limit === "string" ? req.query.limit : "25";
        const search = typeof req.query.search === "string" ? req.query.search : "";
        const sort = typeof req.query.sort === "string" ? req.query.sort : "id";
        const orderRaw = typeof req.query.order === "string" ? req.query.order : "ASC";

        const order = orderRaw.toUpperCase() === "DESC" ? "DESC" : "ASC";

        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const offset = (pageNumber - 1) * limitNumber;

        // ---------------- SEARCH ----------------
        const searchStr = search.trim().replace(/\s+/g, " ");
        const words = searchStr.split(" ").filter(Boolean);

        const fullNameLike = `%${words.join("%")}%`;

        const where = searchStr
          ? {
              [Op.or]: [
                // 🔥 strongest match: sequence match across full name
                {
                  [Op.and]: words.map((word) => ({
                    [Op.or]: [
                      { firstName: { [Op.like]: `%${word}%` } },
                      { middleName: { [Op.like]: `%${word}%` } },
                      { lastName: { [Op.like]: `%${word}%` } },
                    ],
                  })),
                },

                // 🔥 strict full-name sequence match (best one)
                {
                  firstName: { [Op.like]: fullNameLike },
                },
                {
                  lastName: { [Op.like]: fullNameLike },
                },

                // fallback email search
                { email: { [Op.like]: `%${searchStr}%` } },
              ],
            }
          : {};
       

        // ---------------- ORDER SAFE ----------------
        const safeSortFields = [
          "id",
          "firstName",
          "middleName",
          "lastName",
          "email",
          "phoneNumber",
          "address",
          "registered",
        ];

        const finalSort = safeSortFields.includes(sort) ? sort : "id";

        const result = await User.findAndCountAll({
          where,
          limit: limitNumber,
          offset,
          order: [[finalSort, order as "ASC" | "DESC"]],
        });

        return res.json({
          success: true,
          data: result.rows,
          total: result.count,
          hasMore: offset + result.rows.length < result.count,
        });
      } catch (err) {
        console.error("GET /users failed", err);
        return res.status(500).json({ success: false });
      }
    });

    // ---------------- CREATE USER ----------------

    router.post("/", async (req, res) => {
      try {
        const parsed = userSchema.safeParse(req.body);

        if (!parsed.success) {
          return res.status(400).json({
            success: false,
            errors: parsed.error.flatten(),
          });
        }

        // Check if email already exists
        const existingUser = await User.findOne({
          where: { email: parsed.data.email },
        });

        if (existingUser) {
          return res.status(400).json({
            success: false,
            fieldErrors: {
              email: "Email already exists. Please enter a unique email ID.",
            },
          });
        }

        const user = await User.create({
          ...parsed.data,
          registered: new Date(),
        });

        return res.status(201).json({ success: true, data: user });
      } catch (err) {
        return res.status(500).json({ success: false });
      }
    });

    // ---------------- UPDATE USER ----------------
    router.put("/:id", async (req, res) => {
      try {
        const { id } = req.params;

        const user = await User.findByPk(id);

        if (!user) {
          return res.status(404).json({
            success: false,
            message: "User not found",
          });
        }

        const parsed = userSchema.safeParse(req.body);
        if (!parsed.success) {
          return res.status(400).json({
            success: false,
            errors: parsed.error.flatten(),
          });
        }

        // Check if email already exists for a different user
        const existingUser = await User.findOne({
          where: {
            email: parsed.data.email,
            id: { [Op.ne]: id },
          },
        });

        if (existingUser) {
          return res.status(400).json({
            success: false,
            fieldErrors: {
              email: "Email already exists. Please enter a unique email ID.",
            },
          });
        }

        await user.update(parsed.data);
        return res.json({
          success: true,
          data: user,
        });
      } catch (err) {
        console.error("UPDATE user failed", err);
        return res.status(500).json({ success: false });
      }
    });

    // ---------------- DELETE USER ----------------
    router.delete("/:id", async (req, res) => {
      try {
        const { id } = req.params;

        const deleted = await User.destroy({
          where: { id },
        });

        if (!deleted) {
          return res.status(404).json({
            success: false,
            message: "User not found",
          });
        }

        return res.json({
          success: true,
        });
      } catch (err) {
        console.error("DELETE user failed", err);
        return res.status(500).json({ success: false });
      }
    });

    return router;
  },
};

export default UsersRouter;
