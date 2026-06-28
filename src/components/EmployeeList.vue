<script setup>
const props = defineProps({
  employees: { type: Array, required: true },
});
const emit = defineEmits(['edit', 'delete']);

const fmt = new Intl.NumberFormat('ms-MY', { style: 'currency', currency: 'MYR' });
const formatSalary = (val) => fmt.format(val);
const formatDate   = (d)   => new Date(d).toLocaleDateString('en-MY');
</script>

<template>
  <div class="list-wrapper">
    <p v-if="employees.length === 0" class="empty">No employees found.</p>

    <table v-else class="emp-table">
      <thead>
        <tr>
          <th>ID</th><th>Name</th><th>Email</th>
          <th>Dept</th><th>Position</th>
          <th>Hire Date</th><th>Salary</th>
          <th>Status</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="emp in employees" :key="emp.id" :class="{ inactive: !emp.active }">
          <td>{{ emp.empId }}</td>
          <td>{{ emp.name }}</td>
          <td>{{ emp.email }}</td>
          <td>{{ emp.department }}</td>
          <td>{{ emp.position }}</td>
          <td>{{ formatDate(emp.hireDate) }}</td>
          <td>{{ formatSalary(emp.salary) }}</td>
          <td>
            <span :class="emp.active ? 'badge-active' : 'badge-inactive'">
              {{ emp.active ? 'Active' : 'Inactive' }}
            </span>
          </td>
          <td class="actions">
            <button class="btn-edit"   @click="emit('edit', emp)">Edit</button>
            <button class="btn-delete" @click="emit('delete', emp)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>