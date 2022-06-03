<template>
  <div class="container">
    <div class="flex-grid">
          <div class="col-3 push-top">

              <div class="profile-card">

                  <p class="text-center">
                      <img :src="user.avatar" :alt="`imagem de perfil de ${user.name}`" class="avatar-xlarge">
                  </p>

                  <h1 class="title">{{ user.username }}</h1>

                  <p class="text-lead">{{ user.name }}</p>

                  <p class="text-justify">
                      {{ user.bio || '👻'}}
                  </p>

                  <span class="online">{{ user.username }} está online</span>

                  <div class="stats">
                      <span>{{ userPostsCount }} comentários</span>
                      <span>{{ userThreadsCount }} tópicos </span>
                  </div>

                  <hr>

                  <p v-if="user.website" class="text-large text-center"><i class="fa fa-globe"></i> <a :href="user.website" target="_blank">{{ user.website }}</a></p>

              </div>

              <p class="text-xsmall text-faded text-center">Member since june 2003, last visited 4 hours ago</p>

              <div class="text-center">
                <hr>
                <a href="edit-profile.html" class="btn-green btn-small">Edit Profile</a>
              </div>

          </div>

          <div class="col-7 push-top">

              <div class="profile-header">
                  <span class="text-lead">
                      Joker's recent activity
                  </span>
                  <a href="#">See only started threads?</a>
              </div>

              <hr>

              <post-list :posts="userPosts" />
          </div>
      </div>
  </div>
</template>

<script>
import PostList from '@/components/PostList.vue'
import { mapGetters } from 'vuex'
export default {
  components: { PostList },
  computed: {
    ...mapGetters({ user: 'authUser' }),
    userPosts () {
      return this.$store.state.posts.filter(post => post.userId === this.user.id)
    },
    userPostsCount () {
      return this.userPosts.length
    },
    userThreads () {
      return this.$store.state.threads.filter(thread => thread.userId === this.user.id)
    },
    userThreadsCount () {
      return this.userThreads.length
    }
  }
}
</script>

<style>

</style>
