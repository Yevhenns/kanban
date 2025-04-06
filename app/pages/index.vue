<script setup lang="ts">
const toast = useToast();

const projectsStore = useProjectsStore();
const tasksStore = useTasksStore();

const isCreateModalShown = ref(false);
const filter = ref("");

const toggleCreateModal = () => {
  isCreateModalShown.value = !isCreateModalShown.value;
};

const refreshProjects = async () => {
  const res = await projectsStore.getProjectsList();
  if (res) projectsStore.filteredProjects = projectsStore.projects;
};

if (import.meta.client && history.state.project === "deleted") {
  toast.add({ title: "Проект видалено!", color: "success" });
  history.replaceState({}, "");
}

if (import.meta.client && history.state.project === "was deleted") {
  toast.add({ title: "Проект було видалено!", color: "error" });
  history.replaceState({}, "");
}

watch(
  filter,
  () =>
    (projectsStore.filteredProjects = projectsStore.projects.filter((item) =>
      item.title.includes(filter.value)
    ))
);

onMounted(async () => {
  await projectsStore.getProjectsList();
  projectsStore.setCurrentProjectId(null);
  await tasksStore.getAllTasks();
  projectsStore.filteredProjects = projectsStore.projects;
});
</script>

<template>
  <UContainer>
    <div class="flex gap-4 py-4">
      <UButton label="Створити проект" @click="toggleCreateModal" />
      <UInput
        id="filter"
        v-model="filter"
        placeholder="Фільтр"
        aria-label="filter"
      />
    </div>

    <ProjectsTable v-if="projectsStore.filteredProjects.length > 0" />

    <UModal
      v-model:open="projectsStore.isLoadingProjects"
      :close="false"
      title="Завантаження проектів"
    >
      <template #description>
        <span class="sr-only">Завантаження проектів</span>
      </template>
      <template #body>
        <UProgress animation="swing" />
      </template>
    </UModal>

    <h2
      v-if="
        !projectsStore.isLoadingProjects &&
        projectsStore.filteredProjects.length === 0
      "
      class="text-2xl text-center"
    >
      Немає проектів
    </h2>

    <UModal
      v-model:open="isCreateModalShown"
      title="Створити проект"
      class="max-w-100"
    >
      <template #description>
        <span class="sr-only">Створити проект</span>
      </template>
      <template #body>
        <ProjectsCreateForm
          :toggle-create-modal="toggleCreateModal"
          @project-created="refreshProjects"
        />
      </template>
    </UModal>
  </UContainer>
</template>
