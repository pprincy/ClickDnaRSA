<!-- #49 -->
<template>
  <v-col class="mx-4">
    <v-card class="mx-auto">
      <v-card-text>
        <v-toolbar flat>
          <v-toolbar-title>Inbox</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            label="Search"
            class="mx-4"
            prepend-inner-icon="mdi-magnify"
            hide-details
          ></v-text-field>
          <div class="text-center">
            <v-pagination
              v-model="page"
              :length="pageCount"
              :total-visible="5"
            ></v-pagination>
          </div>
        </v-toolbar>
        <v-list two-line>
          <v-list-item-group v-model="selected" active-class="primary--text">
            <template v-for="(item, index) in items">
              <v-list-item :key="item.title" @click="goToDetails(item)">
                <template v-slot:default="{ active }">
                  <v-list-item-content>
                    <v-list-item-title v-text="item.title"></v-list-item-title>

                    <v-list-item-subtitle
                      class="text--primary"
                      v-text="item.headline"
                    ></v-list-item-subtitle>

                    <v-list-item-subtitle
                      v-text="item.subtitle"
                    ></v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-list-item-action-text
                      v-text="item.action"
                    ></v-list-item-action-text>

                    <v-icon v-if="!active" color="grey lighten-1">
                      mdi-attachment
                    </v-icon>

                    <v-icon v-else color="yellow darken-3">
                      mdi-attachment
                    </v-icon>
                  </v-list-item-action>
                </template>
              </v-list-item>

              <v-divider
                v-if="index < items.length - 1"
                :key="index"
              ></v-divider>
            </template>
          </v-list-item-group>
        </v-list>
      </v-card-text>
    </v-card>
  </v-col>
</template>
<script>
export default {
  data: () => ({
    selected: null,
    search: null,
    items: [
      {
        id: 1,
        action: "15 min",
        headline: "Brunch this weekend?",
        subtitle: `I'll be in your neighborhood doing errands this weekend. Do you want to hang out?`,
        title: "Ali Connors",
      },
      {
        id: 2,
        action: "2 hr",
        headline: "Summer BBQ",
        subtitle: `Wish I could come, but I'm out of town this weekend.`,
        title: "me, Scrott, Jennifer",
      },
      {
        id: 3,
        action: "6 hr",
        headline: "Oui oui",
        subtitle: "Do you have Paris recommendations? Have you ever been?",
        title: "Sandra Adams",
      },
      {
        id: 4,
        action: "12 hr",
        headline: "Birthday gift",
        subtitle:
          "Have any ideas about what we should get Heidi for her birthday?",
        title: "Trevor Hansen",
      },
      {
        id: 5,
        action: "18hr",
        headline: "Recipe to try",
        subtitle:
          "We should eat this: Grate, Squash, Corn, and tomatillo Tacos.",
        title: "Britta Holt",
      },
    ],
    page: 1,
    pageCount: 10,
  }),
  methods: {
    goToDetails(item) {
      this.$router.push({
        name: "InboxView",
        params: {
          id: item.id,
        },
      });
    },
  },
};
</script>
