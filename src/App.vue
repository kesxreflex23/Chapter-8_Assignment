<script setup>
import { ref, onMounted, computed } from 'vue';
import SearchSort    from './components/SearchSort.vue';
import EmployeeForm  from './components/EmployeeForm.vue';
import EmployeeList  from './components/EmployeeList.vue';
import {
  fetchEmployees, createEmployee,
  updateEmployee, deleteEmployee,
} from './services/api.js';

const employees  = ref([]);
const loading    = ref(false);
const error      = ref('');
const showForm   = ref(false);
const editTarget = ref(null);

// Search & sort state
const searchQ = ref('');
const sortBy  = ref('name');
const order   = ref('asc');

// Count active employees
const activeCount = computed(() => employees.value.filter(e => e.active).length);

async function loadEmployees() {
  loading.value = true;
  error.value   = '';
  try {
    const res = await fetchEmployees({
      q:      searchQ.value || undefined,
      sortBy: sortBy.value,
      order:  order.value,
    });
    employees.value = res.data;
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

onMounted(loadEmployees);

// ── Search & sort handlers ─────────────────────────────────────────────────
function onSearch(q) { searchQ.value = q; loadEmployees(); }
function onSort({ sortBy: s, order: o }) { sortBy.value = s; order.value = o; loadEmployees(); }

// ── Form handlers ──────────────────────────────────────────────────────────
function openAdd()  { editTarget.value = null;  showForm.value = true; }
function openEdit(emp) { editTarget.value = emp; showForm.value = true; }
function closeForm() { showForm.value = false; editTarget.value = null; }

async function handleSubmit(data) {
  loading.value = true;
  error.value   = '';
  try {
    if (editTarget.value) {
      await updateEmployee(editTarget.value.id, data);
    } else {
      await createEmployee(data);
    }
    closeForm();
    await loadEmployees();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

async function handleDelete(emp) {
  if (!confirm(`Delete ${emp.name} (${emp.empId})? This cannot be undone.`)) return;
  loading.value = true;
  error.value   = '';
  try {
    await deleteEmployee(emp.id);
    await loadEmployees();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="app">
    <header class="app-header">
      <div>
        <h1>Employee Directory</h1>
        <p class="subtitle">{{ activeCount }} active employee{{ activeCount !== 1 ? 's' : '' }}</p>
      </div>
      <button class="btn-primary" @click="openAdd">+ Add Employee</button>
    </header>

    <!-- Error banner -->
    <div v-if="error" class="error-banner">⚠ {{ error }}</div>

    <!-- Loading indicator -->
    <div v-if="loading" class="loading">Loading…</div>

    <!-- Search & Sort -->
    <SearchSort @search="onSearch" @sort="onSort" />

    <!-- Add/Edit Form -->
    <EmployeeForm
      v-if="showForm"
      :edit-target="editTarget"
      @submit="handleSubmit"
      @cancel="closeForm"
    />

    <!-- Employee Table -->
    <EmployeeList
      :employees="employees"
      @edit="openEdit"
      @delete="handleDelete"
    />
  </div>
</template>