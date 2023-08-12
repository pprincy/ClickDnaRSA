<!-- #50 -->
<template>
  <v-col class="mx-4">
    <v-card class="mx-auto">
      <v-toolbar flat>
        <v-btn :to="{ name: 'Inbox' }" icon text>
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-toolbar-title> Brunch this weekend? </v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col cols="1" class="text-h6">From: </v-col>
          <v-col>
            <v-chip>RSA Patel &lt;rsa@ics-global.in&gt;</v-chip>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1" class="text-h6">To: </v-col>
          <v-col>
            <v-chip>RSA Patel &lt;rsa@ics-global.in&gt;</v-chip>
            <v-chip>RSA Patel &lt;rsa@ics-global.in&gt;</v-chip>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1" class="text-h6">CC: </v-col>
          <v-col>
            <v-chip>RSA Patel &lt;rsa@ics-global.in&gt;</v-chip>
            <v-chip>RSA Patel &lt;rsa@ics-global.in&gt;</v-chip>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1" class="text-h6">Body: </v-col>
          <v-col>
            <pre>
              The standard Lorem Ipsum passage, used since the 1500s
"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

Section 1.10.32 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC
"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
            </pre>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="text-h6">Attachments: </v-col>
          <v-col>
            <v-row>
              <template v-for="(item, i) in items">
                <v-col :key="i" cols="12" md="2">
                  <v-hover>
                    <template v-slot:default="{ hover }">
                      <v-card class="mx-auto">
                        <v-img
                          src="https://cdn.vuetifyjs.com/images/cards/forest-art.jpg"
                        ></v-img>
                        <v-fade-transition>
                          <v-overlay v-if="hover" absolute color="#036358">
                            <v-btn icon text>
                              <v-icon>mdi-download</v-icon>
                            </v-btn>
                          </v-overlay>
                        </v-fade-transition>
                      </v-card>
                    </template>
                  </v-hover>
                </v-col>
              </template>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-col>
</template>
<script>
export default {
  data: () => ({
    items: [
      {
        title: "New Releases",
        text: `It's New Release Friday`,
        subtext: "Newly released songs. Updated daily.",
        img: "https://images.unsplash.com/photo-1429514513361-8fa32282fd5f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3264&q=80",
      },
      {
        title: "Rock",
        text: "Greatest Rock Hits",
        subtext: "Lose yourself in rock tunes.",
        img: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2100&q=80",
      },
      {
        title: "Mellow Moods",
        text: "Ambient Bass",
        subtext: "Chill beats to mellow you out.",
        img: "https://images.unsplash.com/photo-1542320868-f4d80389e1c4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3750&q=80",
      },
    ],
    transparent: "rgba(255, 255, 255, 0)",
  }),
};
</script>
<style scoped>
.show-btns {
  color: rgba(255, 255, 255, 1) !important;
}
</style>
