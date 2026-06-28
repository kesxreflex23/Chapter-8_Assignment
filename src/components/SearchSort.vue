<script setup>
import { ref } from 'vue';

const emit = defineEmits(['search', 'sort']);

const query   = ref('');
const sortBy  = ref('name');
const order   = ref('asc');

function onSearch() { emit('search', query.value.trim()); }
function onSort()   { emit('sort', { sortBy: sortBy.value, order: order.value }); }
</script>

<template>
  <div class="search-sort">
    <div class="search-group">
      <input v-model="query" placeholder="Search by name, ID or email…" @input="onSearch" />
    </div>
    <div class="sort-group">
      <select v-model="sortBy" @change="onSort">
        <option value="name">Name</option>
        <option value="empId">Employee ID</option>
        <option value="hireDate">Hire Date</option>
        <option value="salary">Salary</option>
      </select>
      <select v-model="order" @change="onSort">
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  </div>
</template>