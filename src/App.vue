<template>
  <div class="h-100">
    <router-view />
    <!-- <color-switcher /> -->
  </div>
</template>

<script>
import ColorSwitcher from "./components/Common/ColorSwitcher";
import { getDirection, getLanguages } from "./utils";

export default {
  components: {
    "color-switcher": ColorSwitcher
  },
  beforeMount() {
    const direction = getDirection();
    document.body.classList.add("rounded");
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
    }
    if (direction.isRtl) {
      document.body.classList.add("rtl");
      document.dir = "rtl";
      document.body.classList.remove("ltr");
    } else {
      document.body.classList.add("ltr");
      document.dir = "ltr";
      document.body.classList.remove("rtl");
    }
  },
};
</script>
