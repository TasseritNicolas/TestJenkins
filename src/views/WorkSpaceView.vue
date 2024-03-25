<template>
  <div class="container mx-auto py-8 flex">
    <div class="w-1/2 border-r-2 border-gray-300 pr-4 p-4">
      <h1 class="text-3xl font-bold mb-4">Workspaces</h1>
      <div v-for="workspace in workspaces" :key="workspace.id" class="mb-4">
        <button @click="toggleDropdown(workspace.id)" class="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-full inline-flex items-center w-full"> <!-- Utilisation de w-full pour étirer le bouton sur toute la largeur -->
          {{ workspace.name }}
          <svg v-if="isDropdownVisible(workspace.id)" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3 7a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1zM3 13a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1z" clip-rule="evenodd" />
          </svg>
        </button>
        <ul v-if="isDropdownVisible(workspace.id)" class="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
          <li v-for="board in workspace.boards" :key="board.id" class="px-4 py-2 hover:bg-gray-100 cursor-pointer">{{ board.name }}</li>
        </ul>
      </div>
    </div>
    <div class="w-1/2 pl-4">

    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'Workspaces',
  setup() {
    const workspaces = ref([]);

    const API_KEY = import.meta.env.VITE_TRELLO_CLIENT_ID;
    const API_TOKEN = localStorage.getItem("token");

    const dropdownState = ref({});

    const toggleDropdown = (workspaceId) => {
      dropdownState.value[workspaceId] = !dropdownState.value[workspaceId];
    };

    const isDropdownVisible = (workspaceId) => {
      return dropdownState.value[workspaceId];
    };

    onMounted(async () => {
      try {
        const response = await fetch(`https://api.trello.com/1/members/me/organizations?key=${API_KEY}&token=${API_TOKEN}`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des workspaces depuis l\'API Trello');
        }
        const data = await response.json();
        // Extraction des noms des workspaces
        for (const workspace of data) {
          const boardsResponse = await fetch(`https://api.trello.com/1/organizations/${workspace.id}/boards?key=${API_KEY}&token=${API_TOKEN}`);
          if (!boardsResponse.ok) {
            throw new Error('Erreur lors de la récupération des boards depuis l\'API Trello');
          }
          const boardsData = await boardsResponse.json();
          workspace.boards = boardsData.map(board => ({ id: board.id, name: board.name }));
        }
        workspaces.value = data.map(workspace => ({ id: workspace.id, name: workspace.displayName || workspace.name, boards: workspace.boards || [] }));
      } catch (error) {
        console.error(error);
      }
    });

    return { workspaces, toggleDropdown, isDropdownVisible };
  }
};
</script>
