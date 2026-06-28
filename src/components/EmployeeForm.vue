<script setup>
import { ref, watch } from 'vue';

const props = defineProps({ editTarget: { type: Object, default: null } });
const emit  = defineEmits(['submit', 'cancel']);

const DEPTS = ['IT', 'HR', 'Finance', 'Marketing', 'Operations'];

const blank = () => ({
  empId: '', name: '', email: '', department: '',
  position: '', hireDate: '', salary: '', active: true,
});

const form   = ref(blank());
const errors = ref({});

// When parent passes an employee to edit, fill the form
watch(() => props.editTarget, (val) => {
  if (val) {
    form.value = {
      ...val,
      hireDate: val.hireDate ? String(val.hireDate).slice(0, 10) : '',
    };
  } else {
    form.value = blank();
  }
  errors.value = {};
}, { immediate: true });

// ── Validation ─────────────────────────────────────────────────────────────
function validate() {
  const e = {};
  if (!/^EMP[0-9]{3,5}$/.test(form.value.empId))
    e.empId = 'Must match EMP followed by 3–5 digits (e.g. EMP001).';
  if (!form.value.name.trim() || form.value.name.trim().length < 3)
    e.name = 'Name must be at least 3 characters.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email))
    e.email = 'Enter a valid email address.';
  if (!form.value.department)
    e.department = 'Please select a department.';
  if (!form.value.position.trim())
    e.position = 'Position is required.';
  if (!form.value.hireDate)
    e.hireDate = 'Hire date is required.';
  else if (new Date(form.value.hireDate) > new Date())
    e.hireDate = 'Hire date cannot be in the future.';
  const sal = Number(form.value.salary);
  if (isNaN(sal) || sal < 1500 || sal > 50000)
    e.salary = 'Salary must be between RM 1,500 and RM 50,000.';

  errors.value = e;
  return Object.keys(e).length === 0;
}

function handleSubmit() {
  if (!validate()) return;
  emit('submit', { ...form.value, salary: Number(form.value.salary) });
}

function handleCancel() {
  form.value  = blank();
  errors.value = {};
  emit('cancel');
}
</script>

<template>
  <div class="form-card">
    <h2>{{ editTarget ? 'Edit Employee' : 'Add New Employee' }}</h2>

    <div class="form-grid">
      <!-- Employee ID -->
      <div class="field">
        <label>Employee ID</label>
        <input v-model.trim="form.empId" placeholder="EMP001" :disabled="!!editTarget" />
        <span v-if="errors.empId" class="error">{{ errors.empId }}</span>
      </div>

      <!-- Name -->
      <div class="field">
        <label>Full Name</label>
        <input v-model.trim="form.name" placeholder="Full name" />
        <span v-if="errors.name" class="error">{{ errors.name }}</span>
      </div>

      <!-- Email -->
      <div class="field">
        <label>Email</label>
        <input v-model.trim="form.email" type="email" placeholder="name@company.com" />
        <span v-if="errors.email" class="error">{{ errors.email }}</span>
      </div>

      <!-- Department -->
      <div class="field">
        <label>Department</label>
        <select v-model="form.department">
          <option value="">— Select —</option>
          <option v-for="d in DEPTS" :key="d">{{ d }}</option>
        </select>
        <span v-if="errors.department" class="error">{{ errors.department }}</span>
      </div>

      <!-- Position -->
      <div class="field">
        <label>Position</label>
        <input v-model.trim="form.position" placeholder="Job title" />
        <span v-if="errors.position" class="error">{{ errors.position }}</span>
      </div>

      <!-- Hire Date -->
      <div class="field">
        <label>Hire Date</label>
        <input v-model="form.hireDate" type="date" />
        <span v-if="errors.hireDate" class="error">{{ errors.hireDate }}</span>
      </div>

      <!-- Salary -->
      <div class="field">
        <label>Salary (RM)</label>
        <input v-model.number="form.salary" type="number" min="1500" max="50000" placeholder="e.g. 5000" />
        <span v-if="errors.salary" class="error">{{ errors.salary }}</span>
      </div>

      <!-- Active -->
      <div class="field checkbox-field">
        <label>
          <input v-model="form.active" type="checkbox" />
          Active Employee
        </label>
      </div>
    </div>

    <div class="form-actions">
      <button class="btn-primary" @click="handleSubmit">
        {{ editTarget ? 'Save Changes' : 'Add Employee' }}
      </button>
      <button class="btn-secondary" @click="handleCancel">Cancel</button>
    </div>
  </div>
</template>