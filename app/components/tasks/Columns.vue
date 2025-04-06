<script setup lang="ts">
import { computed } from "vue";
import { useTasksStore } from "@/stores/tasks";
import { useProjectsStore } from "@/stores/projects";

defineProps<{
  toggleCreateModal: () => void;
}>();

const projectsStore = useProjectsStore();
const tasksStore = useTasksStore();

const tasks = computed(() => {
  return tasksStore.allTasks.filter(
    (task) => task.projectId === projectsStore.currentProject?.id
  );
});
</script>

<template>
  <div>
    <h2 class="heading">Завдання</h2>
    <div class="columnsWrapper">
      <TasksColumnItem
        :tasks="tasks"
        status="todo"
        :toggle-create-modal="toggleCreateModal"
      />
      <TasksColumnItem :tasks="tasks" status="in_progress" />
      <TasksColumnItem :tasks="tasks" status="done" />
    </div>
  </div>
</template>

<style scoped lang="css">
.heading {
  text-align: center;
  font-size: 24px;
  font-weight: 600;
}

.columnsWrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-top: 20px;
}
</style>
