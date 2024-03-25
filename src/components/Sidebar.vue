<template>
  <div class="flex bg-gray-100 text-gray-900">
    <aside class="flex h-screen w-20 flex-col items-center border-r border-gray-200 bg-white">
      <div class="flex h-[4.5rem] w-full items-center justify-center border-b border-gray-200 p-2">
        <h1 class="text-2xl font-fredoka text-indigo-600">T.T</h1>
      </div>
      <nav class="flex flex-1 flex-col gap-y-4 pt-10">
        <button @click="CreateBoard()" class="group relative rounded-xl bg-gray-100 p-2 text-blue-600 hover:bg-gray-50">
          <svg class="h-6 w-6 stroke-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 9V15M9 12H15H9Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>

          <div class="absolute inset-y-0 left-12 hidden items-center group-hover:flex">
            <div class="relative whitespace-nowrap rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 drop-shadow-lg">
              <div class="absolute inset-0 -left-1 flex items-center">
                <div class="h-2 w-2 rotate-45 bg-white"></div>
              </div>
              Create Board
            </div>
          </div>
        </button>
        <div class="flex flex-1 flex-col gap-y-4 pt-10 space-y-9  ">
          <ul>
            <li v-if="boards.length === 0">No paintings found</li>
            <li v-else v-for="board in boards.slice(0, 20)" :key="board.id" class="group flex items-center">
              <button @click="selectBoard(board.id)" class="board-button relative bg-gray-100 p-2 text-blue-600 hover:bg-gray-50 text-base mb-4 rounded-xl w-10 z-10">
                {{ board.name.charAt(0).toUpperCase() }}
                <div class="absolute inset-y-0 left-12 hidden items-center group-hover:flex">
                  <div class="absolute whitespace-nowrap rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 drop-shadow-lg">
                    <div class="absolute inset-0 -left-1 flex items-center">
                      <div class="h-2 w-2 rotate-45 bg-white"></div>
                    </div>
                    {{ board.name }}
                  </div>
                </div>
              </button>

            </li>
          </ul>
        </div>
      </nav>

      <div class="flex flex-col items-center gap-y-4 py-2">
        <button class="group relative rounded-xl p-2 text-gray-600 hover:text-indigo-600" @click="onLogout">
          <i class="fa-solid fa-arrow-right-from-bracket"></i>
        </button>
      </div>

      <div class="flex flex-col items-center gap-y-4 pb-6">
        <button class="mt-2 rounded-full bg-gray-100">
          <img class="h-10 w-10 rounded-full"
               src="https://avatars.githubusercontent.com/u/35387401?v=4" alt=""/>
        </button>
      </div>
    </aside>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import axios from "axios";

export default {
  data() {
    return {
      boards: [],
      showDropdown: false
    };
  },
  mounted() {
    this.fetchBoards();
  },
  methods: {
    fetchBoards() {
      const API_KEY = import.meta.env.VITE_TRELLO_CLIENT_ID;
      const API_TOKEN = localStorage.getItem("token");
      fetch(`https://api.trello.com/1/members/me/boards?key=${API_KEY}&token=${API_TOKEN}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      })
          .then(response => {
            if (!response.ok) {
              throw new Error(`La requête a échoué: ${response.status} - ${response.statusText}`);
            }
            return response.json();
          })
          .then(data => {
            this.boards = data;
          })
          .catch(err => {
            console.error(err);
          });
    },
    onLogout() {
      localStorage.removeItem('token');
      localStorage.removeItem('trello_user_info');
      window.location.href = '/';
    },
    selectBoard(boardId) {
      this.$emit('board-selected', boardId);
    },
    CreateBoard() {
      const API_KEY = import.meta.env.VITE_TRELLO_CLIENT_ID;
      const API_TOKEN = localStorage.getItem("token");

      Swal.fire({
        title: 'Entrez le nom du nouveau tableau',
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Créer',
        showLoaderOnConfirm: true,
        preConfirm: (name) => {
          const organizationId = '65f71acf74f1cf62f14f9e43'; // ID de l'organisation
          const data = {
            name: encodeURIComponent(name),
            idOrganization: organizationId
          };

          return fetch(`https://api.trello.com/1/boards?key=${API_KEY}&token=${API_TOKEN}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          })
              .then(response => {
                if (!response.ok) {
                  throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
                }
                return response.json();
              })
              .then(data => {
                console.log('Tableau créé avec succès:', data);
                Swal.fire({
                  title: `Tableau '${name}' créé avec succès!`
                });
              })
              .catch(error => {
                Swal.showValidationMessage(`Échec de la création : ${error}`);
              });
        },
        allowOutsideClick: () => !Swal.isLoading()
      });
    }
  }
};
</script>
