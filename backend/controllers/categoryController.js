const Category = require("../models/Category");

const DEFAULT_CATEGORIES = [
  { name: "General", color: "#94a3b8", icon: "📋", isDefault: true },
  { name: "Work", color: "#6366f1", icon: "💼", isDefault: true },
  { name: "Personal", color: "#10b981", icon: "🏠", isDefault: true },
  { name: "Fitness", color: "#f59e0b", icon: "💪", isDefault: true },
  { name: "Education", color: "#3b82f6", icon: "📚", isDefault: true },
];

const seedDefaultCategories = async () => {
  try {
    const count = await Category.countDocuments();
    if (count === 0) {
      await Category.insertMany(DEFAULT_CATEGORIES);
      console.log("Default categories seeded.");
    }
  } catch (err) {
    console.error("Seed categories error:", err.message);
  }
};

const getCategories = async (req, res) => {
  try {
    await seedDefaultCategories();
    const categories = await Category.find({}).sort({ isDefault: -1, name: 1 });
    res.json(categories);
  } catch (error) {
    console.error("Get Categories Error:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, color, icon, description } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Category name is required" });
    }

    const exists = await Category.findOne({ name: name.trim() });
    if (exists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({
      name: name.trim(),
      color: color || "#7c3aed",
      icon: icon || "📁",
      description: description || "",
    });

    res.status(201).json(category);
  } catch (error) {
    console.error("Create Category Error:", error);
    res.status(500).json({ message: "Failed to create category" });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const { name, color, icon, description } = req.body;

    if (name && name.trim() !== category.name) {
      const exists = await Category.findOne({ name: name.trim(), _id: { $ne: req.params.id } });
      if (exists) {
        return res.status(400).json({ message: "Category name already in use" });
      }
      category.name = name.trim();
    }

    if (color) category.color = color;
    if (icon) category.icon = icon;
    if (description !== undefined) category.description = description;

    const updated = await category.save();
    res.json(updated);
  } catch (error) {
    console.error("Update Category Error:", error);
    res.status(500).json({ message: "Failed to update category" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (category.isDefault) {
      return res.status(403).json({ message: "Cannot delete a default category" });
    }

    await category.deleteOne();
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete Category Error:", error);
    res.status(500).json({ message: "Failed to delete category" });
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
