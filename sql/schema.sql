DROP DATABASE IF EXISTS employee_directory;
CREATE DATABASE employee_directory;
USE employee_directory;

CREATE TABLE employees (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  empId    VARCHAR(10)    NOT NULL UNIQUE,
  name     VARCHAR(100)   NOT NULL,
  email    VARCHAR(100)   NOT NULL UNIQUE,
  department VARCHAR(50)  NOT NULL,
  position VARCHAR(100)   NOT NULL,
  hireDate DATE           NOT NULL,
  salary   DECIMAL(10,2)  NOT NULL,
  active   TINYINT(1)     NOT NULL DEFAULT 1
);

INSERT INTO employees (empId, name, email, department, position, hireDate, salary, active) VALUES
('EMP001', 'Ahmad Faris',      'ahmad.faris@company.com',    'IT',         'Software Engineer',     '2021-03-15', 5500.00, 1),
('EMP002', 'Nurul Ain',        'nurul.ain@company.com',      'HR',         'HR Executive',          '2020-07-01', 4200.00, 1),
('EMP003', 'Lim Wei Jie',      'lim.weijie@company.com',     'Finance',    'Senior Accountant',     '2019-11-20', 6800.00, 1),
('EMP004', 'Priya Nair',       'priya.nair@company.com',     'Marketing',  'Marketing Manager',     '2018-05-10', 7500.00, 1),
('EMP005', 'Mohd Hakim',       'mohd.hakim@company.com',     'Operations', 'Operations Executive',  '2022-01-03', 3800.00, 0),
('EMP006', 'Siti Rashidah',    'siti.rashidah@company.com',  'IT',         'UI/UX Designer',        '2023-02-14', 4900.00, 1),
('EMP007', 'Tan Bee Leng',     'tan.beeleng@company.com',    'Finance',    'Finance Analyst',       '2021-09-08', 5200.00, 1);