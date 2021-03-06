<template>
  <div class="container-fluid">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/doc">Doc</router-link>
    </div>
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#nav {
  padding: 30px 0 10px 0;
}

#nav a {
  font-weight: bold;
}

#nav a.router-link-exact-active {
  color: black;
}
</style>
