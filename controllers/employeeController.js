const Employee = require("../model/Employee");

const getAllEmployees = async (req, res) => {
  const employees = await Employee.find();
  if (!employees) {
    return res.status(204).json({ message: "No employees found" });
  }
  return res.json(employees);
};

const createNewEmployee = async (req, res) => {
  if (!req?.body?.firstname || !req?.body?.lastname) {
    return res
      .status(400)
      .json({ message: "First and Lastnames are required" });
  }

  try {
    const result = await Employee.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });

    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
};

const updateEmployee = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: "ID parameter is required" });
  }

  const employee = await Employee.findOne({ _id: req.body.id }).exec();

  if (!employee) {
    return res
      .status(204)
      .json({ message: `No Employees matched the id ${req.body.id}` });
  }

  if (req?.body?.firstname) employee.firstname = req.body.firstname;
  if (req?.body?.lastname) employee.lastname = req.body.lastname;
  const result = await employee.save();
  res.json(result);
};

const deleteEmployee = async (req, res) => {
  if (!req?.body?.id)
    return res.status(400).json({ message: "Employee not found" });

  const employee = await Employee.findOne({ _id: req.body.id }).exec();

  if (!employee) {
    return res
      .status(400)
      .json({ message: `No Employee Matched ${req.body.id}` });
  }

  const result = await Employee.deleteOne({ _id: req.body.id });
  res.json(result);
};

const getEmployee = async (req, res) => {
  if (!req?.params?.id) {
    res
      .status(400)
      .json({ message: "Employee with given id couldnt be found" });
  }
  const employee = await Employee.findOne({ _id: req.params.id }).exec();
  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee with ${req.params.id} doesn't exist` });
  }
  res.json(employee);
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
