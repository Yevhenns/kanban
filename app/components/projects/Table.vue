<script setup lang="ts">
import { VueDraggable } from "vue-draggable-plus";
import { useRouter } from "vue-router";

const projectStore = useProjectsStore();

const router = useRouter();

const goToProject = (id: string) => {
  projectStore.setCurrentProjectId(id);
  router.push(`/${id}`);
};

const onEnd = () => {
  console.log(projectStore.filteredProjects);
};
</script>

<template>
  <VueDraggable
    v-model="projectStore.filteredProjects"
    target=".sort-target"
    :animation="150"
    @end="onEnd"
  >
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Назва</th>
          <th>Кількість завдань</th>
          <th>Статус</th>
          <th>Дата створення</th>
        </tr>
      </thead>
      <tbody class="sort-target">
        <tr
          v-for="project in projectStore.filteredProjects"
          :key="project.id"
          class="cursor-move"
          @click="goToProject(project.id)"
        >
          <td>
            <p>{{ project.id }}</p>
          </td>
          <td>
            <p>{{ project.title }}</p>
          </td>
          <td>
            <p>{{ project.tasks.length }}</p>
          </td>
          <td>
            <p>{{ project.status }}</p>
          </td>
          <td>
            <p>{{ project.createdAt }}</p>
          </td>
        </tr>
      </tbody>
    </table>
  </VueDraggable>
</template>

<style scoped lang="css">
.table {
  margin-left: auto;
  margin-right: auto;
  width: 80%;
  border-collapse: collapse;
  background-color: #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

th {
  background-color: var(--color-green-600);
  color: white;
  padding: 12px 20px;
  text-align: left;
  font-weight: 600;
  font-size: 16px;
  border-bottom: 2px solid #2980b9;
  border-right: 1px solid #ddd;
}

td {
  padding: 10px 20px;
  text-align: left;
  font-size: 14px;
  color: #333;
  border-top: 1px solid #ddd;
  border-right: 1px solid #ddd;
}

tr:nth-child(even) {
  background-color: #f4f6f9;
}

tr.cursor-move {
  cursor: move;
}

td p {
  margin: 0;
  word-wrap: break-word;
}

th:last-child,
td:last-child {
  border-right: none;
}
</style>
