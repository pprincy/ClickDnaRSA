<!-- #2 -->
<template>
  <v-col class="mx-4">
    <v-row>
      <Countries
        @addCountry="addCountry"
        :carriers="true"
        :origin="origin"
        :destination="destination"
        :client-id="clientId"
        :disabled-client-id="disabledClientId"
        @updateClientId="(res) => (clientId = res)"
      />
      <v-col @drop="onDrop($event)" @dragover.prevent @dragenter.prevent>
        <p class="text-h6">
          <span v-if="linehaul">
            {{ linehaul.origin.name }} -> {{ linehaul.destination.name }} -
            {{ linehaul.create_date | moment("DD MMM, YYYY") }}
          </span>
          <v-btn
            class="float-right"
            color="primary"
            @click="$refs.chart.save()"
            :loading="uiLoader"
            >Save</v-btn
          >
          <v-icon
            color="primary"
            x-large
            @click="dialog = true"
            class="mr-2 float-right"
            >mdi-information</v-icon
          >
        </p>
        <v-progress-linear
          :active="uiLoader"
          :indeterminate="uiLoader"
        ></v-progress-linear>
        <Flowchart
          :nodes="nodes"
          :connections="connections"
          @editnode="handleEditNode"
          @save="handleChartSave"
          ref="chart"
          :render="render"
          style="width: auto"
        >
        </Flowchart>
      </v-col>
      <Carriers
        @addCarrier="addCarrier"
        :country-node="countryNode"
        ref="carriers"
        :nodes="allNodes"
        :client-id="clientId"
      />
    </v-row>
    <NodeDialog
      :visible.sync="nodeDialogVisible"
      :node.sync="nodeForm.target"
      :carriers="carriers"
      :nodes="allNodes"
      :origin="origin"
      :destination="destination"
    ></NodeDialog>
    <v-dialog v-model="dialog" max-width="500">
      <GuideLine />
    </v-dialog>
  </v-col>
</template>
<script>
import Vue from "vue";
import Flowchart from "@/components/front/linehaul/flowchart/Flowchart.vue";
import NodeDialog from "@/components/front/linehaul/NodeDialog.vue";
import Countries from "@/components/front/linehaul/Countries.vue";
import Carriers from "@/components/front/linehaul/Carriers.vue";
import GuideLine from "@/components/front/linehaul/GuideLine.vue";
import { mapActions, mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["linehaulConfig"]),
  },
  components: {
    NodeDialog,
    Countries,
    Carriers,
    Flowchart,
    GuideLine,
  },
  data() {
    return {
      carriers: [],
      nodes: [],
      connections: [],
      nodeForm: { target: null },
      connectionForm: { target: null, carrier: null },
      nodeDialogVisible: false,
      dialog: false,
      countryNode: null,
      uiLoader: false,
      origin: null,
      destination: null,
      linehaul: null,
      allNodes: [],
      clientId: null,
      disabledClientId: false,
    };
  },
  created() {
    this.getLinehaulConfig(this.$route.params.id);
    this.fetchLinehaulUIData();
  },
  methods: {
    ...mapActions([
      "snackBar",
      "getLinehaulUIData",
      "getLinehaulConfig",
      "updateLinehaulUIData",
    ]),
    fetchLinehaulUIData() {
      if (+this.$route.params.id === 0) return;
      this.uiLoader = true;
      this.getLinehaulUIData({
        id: this.$route.params.id,
        params: {},
      })
        .then((res) => {
          this.uiLoader = false;
          this.nodes = res.data.node.map((n) => {
            const node = {
              id: n.id,
              displayText: n.displayText,
              countryCode: n.country,
              country: n.country,
              data: n.data,
              type: n.node_type,
              x: n.props.x,
              y: n.props.y,
              width: n.props.width,
              height: n.props.height,
              readonly: n.readonly,
              carrier_ids: n.carrier_ids,
              carrier_settings: n.carrier_settings,
            };
            if (n.node_type === "origin") {
              this.countryNode = node;
              this.origin = n.data;
            }
            if (n.node_type === "destination") {
              this.destination = n.data;
            }
            return node;
          });
          this.connections = res.data.connections;
          this.linehaul = res.data.linehaul;
          this.clientId = res.data.client_id;
          this.disabledClientId = true;
        })
        .catch(() => {
          this.uiLoader = false;
        });
    },
    saveNodesConnections(nodes, connections, status = 1) {
      this.uiLoader = true;
      this.updateLinehaulUIData({
        node: nodes.map((n) => {
          return {
            id: n.id,
            country: n.countryCode,
            displayText: n.displayText || "",
            data: n.data,
            node_type: n.type,
            props: {
              x: n.x,
              y: n.y,
              height: n.height,
              width: n.width,
            },
            readonly: n.readonly,
            carrier_ids: n.carrier_ids,
            carrier_settings: n.carrier_settings,
          };
        }),
        connections: connections,
        status,
        client_id: this.clientId,
      })
        .then((res) => {
          this.disabledClientId = true;
          this.uiLoader = false;
          if (status === 1) {
            this.snackBar({
              color: "success",
              message: res.data.message,
            });
          }
          if (+this.$route.params.id === 0) {
            return this.$router.replace({
              name: "LinehaulEdit",
              params: {
                id: res.data.id,
              },
            });
          }
        })
        .catch(() => {
          this.uiLoader = false;
        });
    },
    handleChartSave(nodes, connections) {
      this.saveNodesConnections(nodes, connections);
    },
    handleEditNode(node) {
      if (
        ["origin", "destination", "terminal", "client", "consumer"].includes(
          node.type
        )
      )
        return;
      this.nodeForm.target = node;
      this.nodeDialogVisible = true;
    },
    render: function (g, node, isSelected) {
      node.width = node.width || 120;
      node.height = node.height || 60;
      if (node.type === "origin" || node.type === "destination") {
        g.append("text")
          .attr("x", node.x + node.width / 2)
          .attr(
            "y",
            node.type === "origin" ? node.y - 5 : node.y + node.height + 15
          )
          .attr("class", "unselectable")
          .attr("text-anchor", "middle")
          .text(node.displayText);
      }
      g.append("svg:image")
        .attr("x", node.x)
        .attr("y", node.y)
        .attr("width", node.width)
        .attr("class", isSelected ? "selected" : "not-selected")
        .attr("height", node.height)
        .attr(
          "xlink:href",
          node.type === "origin" || node.type === "destination"
            ? Vue.filter("assetURL")(node.data.flag_url)
            : node.type === "carrier"
            ? Vue.filter("assetURL")(node.data.carrier_logo)
            : Vue.filter("assetURL")(node.data.logo)
        );
      if (isSelected) {
        if (["origin", "destination", "terminal"].includes(node.type)) {
          this.countryNode = node;
        } else {
          this.countryNode = this.$refs.chart.internalNodes
            .filter((n) =>
              ["origin", "destination", "terminal"].includes(n.type)
            )
            .find((c) => c.id.split("-")[0] === node.country.split("-")[0]);
        }
      }
      const hasLabel = node.carrier_settings?.find(
        (cs) => cs.label_logic?.length
      );
      const hasRestrictions = node.carrier_settings?.find(
        (cs) =>
          cs.restrictions?.city_postals?.length ||
          cs.restrictions?.customers?.length ||
          cs.restrictions?.dimensions?.length ||
          cs.restrictions?.weight_ranges?.length
      );
      if (hasLabel) {
        g.append("svg:image")
          .attr("x", node.x + (hasRestrictions ? 20 : 30))
          .attr("y", node.y + node.height)
          .attr("width", 20)
          .attr("height", 20)
          .attr("xlink:href", "/images/printer.png");
      }
      if (hasRestrictions) {
        g.append("svg:image")
          .attr("x", node.x + (hasLabel ? 40 : 30))
          .attr("y", node.y + node.height)
          .attr("width", 20)
          .attr("height", 20)
          .attr("xlink:href", "/images/alert.png");
      }
      this.allNodes = this.$refs.chart.internalNodes;
    },
    onDrop(e) {
      if (e.dataTransfer.getData("country")) {
        const node = JSON.parse(e.dataTransfer.getData("country"));
        this.addCountry(node);
      }
      if (e.dataTransfer.getData("carrier")) {
        const node = JSON.parse(e.dataTransfer.getData("carrier"));
        this.addCarrier(node);
      }
    },
    addTerminalAndTransitPartner(cNodes) {
      if (
        this.origin.code !== this.linehaulConfig.settings.terminal_country_code
      ) {
        let terminalNode;
        if (
          this.destination.code ===
          this.linehaulConfig.settings.terminal_country_code
        ) {
          terminalNode = Object.assign({}, this.destination);
        } else {
          terminalNode = this.linehaulConfig?.entity_objects?.find(
            (i) => i.code === "terminal"
          );
        }
        this.$refs.chart.add({
          id:
            this.linehaulConfig.settings.terminal_country_code +
            "-" +
            terminalNode.id,
          x: 60,
          y: 200,
          data: Object.assign({}, terminalNode, {
            terminal_airport_code:
              this.linehaulConfig.settings.terminal_airport_code,
          }),
          type:
            this.destination.code ===
            this.linehaulConfig.settings.terminal_country_code
              ? "destination"
              : terminalNode.code,
          displayText:
            this.destination.code ===
            this.linehaulConfig.settings.terminal_country_code
              ? "Destination"
              : "",
          country:
            this.linehaulConfig.settings.terminal_country_code +
            "-" +
            terminalNode.id,
          countryCode: this.linehaulConfig.settings.terminal_country_code,
          width: 90,
          height: 60,
          carrier_ids: [],
          carrier_settings: [],
          readonly: terminalNode.readonly_entity,
        });
        this.addConnection(
          cNodes.find((n) => n.type === "origin").id,
          this.linehaulConfig.settings.terminal_country_code +
            "-" +
            terminalNode.id,
          "bottom",
          "top",
          true
        );
      }

      const transitNode = this.linehaulConfig?.entity_objects?.find(
        (i) => i.code === "transit_partner"
      );
      this.$refs.chart.add({
        id:
          this.linehaulConfig.settings.terminal_country_code +
          "-" +
          transitNode.id,
        x: 60,
        y: 320,
        data: transitNode,
        type: transitNode.code,
        country:
          this.linehaulConfig.settings.terminal_country_code +
          "-" +
          transitNode.id,
        countryCode: this.linehaulConfig.settings.terminal_country_code,
        width: 90,
        height: 60,
        carrier_ids: [],
        carrier_settings: [],
        readonly: transitNode.readonly_entity,
      });
      this.addConnection(
        cNodes.find(
          (n) =>
            n.type ===
            (this.destination.code ===
            this.linehaulConfig.settings.terminal_country_code
              ? "destination"
              : this.origin.code ===
                this.linehaulConfig.settings.terminal_country_code
              ? "origin"
              : "terminal")
        ).id,
        this.linehaulConfig.settings.terminal_country_code +
          "-" +
          transitNode.id,
        this.destination.code ===
          this.linehaulConfig.settings.terminal_country_code
          ? "right"
          : "bottom",
        "top",
        true
      );
    },
    addCountry(node) {
      const cNodes = this.$refs.chart.internalNodes;
      if (cNodes.findIndex((n) => n.type === "origin") < 0) {
        node.x = 60;
        node.y = 80;
        node.type = "origin";
        node.displayText = "Origin";
        node.readonly = true;
        this.origin = node.data;
      } else {
        node.x = 60;
        node.y = 460;
        node.type = "destination";
        node.displayText = "Destination";
        node.readonly = true;
        this.destination = node.data;

        // select origin country and add origin agent
        this.countryNode = this.$refs.chart.internalNodes.find(
          (n) => n.type === "origin"
        );

        // to add terminal and transit partner
        this.addTerminalAndTransitPartner(cNodes);

        this.$nextTick(() => {
          this.$refs.carriers.addEntityNode("origin_agent");

          // select origin agent and add client
          this.$nextTick(() => {
            this.$refs.chart.currentNodes = [
              this.$refs.chart.internalNodes.find(
                (n) => n.type === "origin_agent"
              ),
            ];
            this.$nextTick(() => {
              this.$refs.carriers.addEntityNode("client");
              this.$nextTick(() => {
                // select transit partner and add last mile agent
                this.$refs.chart.currentNodes = [
                  this.$refs.chart.internalNodes.find(
                    (n) => n.type === "transit_partner"
                  ),
                ];
                this.$nextTick(() => {
                  this.$refs.carriers.addEntityNode("last_mile_agent");
                  this.$nextTick(() => {
                    // select last mile agent and add consumer
                    this.$refs.chart.currentNodes = [
                      this.$refs.chart.internalNodes.find(
                        (n) =>
                          n.type === "last_mile_agent" &&
                          n.countryCode ===
                            this.linehaulConfig.settings.terminal_country_code
                      ),
                    ];

                    this.$nextTick(() => {
                      this.$refs.carriers.addEntityNode("consumer");
                      if (
                        this.destination.code ===
                        this.linehaulConfig.settings.terminal_country_code
                      ) {
                        this.$nextTick(() => {
                          this.saveNodesConnections(
                            this.$refs.chart.internalNodes,
                            this.$refs.chart.internalConnections,
                            0
                          );
                        });
                      } else {
                        this.$nextTick(() => {
                          // select destination and add last mile agent
                          this.$refs.chart.currentNodes = [
                            this.$refs.chart.internalNodes.find(
                              (n) => n.type === "destination"
                            ),
                          ];
                          this.$nextTick(() => {
                            this.$refs.carriers.addEntityNode(
                              "last_mile_agent"
                            );
                            this.$nextTick(() => {
                              // select last mile agent and add consumer
                              this.$refs.chart.currentNodes = [
                                this.$refs.chart.internalNodes.find(
                                  (n) =>
                                    n.type === "last_mile_agent" &&
                                    n.countryCode === this.destination.code
                                ),
                              ];
                              this.$nextTick(() => {
                                this.$refs.carriers.addEntityNode("consumer");
                                this.$nextTick(() => {
                                  this.saveNodesConnections(
                                    this.$refs.chart.internalNodes,
                                    this.$refs.chart.internalConnections,
                                    0
                                  );
                                });
                              });
                            });
                          });
                        });
                      }
                    });
                  });
                });
              });
            });
          });
        });
      }
      if (
        node.countryCode === this.origin.code ||
        node.countryCode !== this.linehaulConfig.settings.terminal_country_code
      ) {
        this.$refs.chart.add(node);
        if (node.countryCode === this.destination?.code) {
          this.addConnection(
            cNodes.find((n) => n.type === "transit_partner").id,
            node.id,
            "bottom",
            "top",
            true
          );
        }
      }
    },
    addCarrier(node) {
      if (this.$refs.chart.currentNodes.length === 1) {
        node.x = this.$refs.chart.currentNodes[0].x + 200;
        node.y = this.$refs.chart.currentNodes[0].y;
      } else {
        node.x = this.countryNode.x + 200;
        node.y = this.countryNode.y;
      }

      node.country = this.countryNode.id;
      this.$refs.chart.add(node);
      if (
        this.countryNode.type === "origin" &&
        !["last_mile_agent", "consumer"].includes(node.type)
      ) {
        this.addConnection(
          node.id,
          this.$refs.chart.currentNodes.length === 1
            ? this.$refs.chart.currentNodes[0].id
            : this.countryNode.id,
          "left",
          "right",
          true
        );
      } else {
        this.addConnection(
          this.$refs.chart.currentNodes.length === 1
            ? this.$refs.chart.currentNodes[0].id
            : this.countryNode.id,
          node.id,
          "right",
          "left",
          true
        );
      }
    },
    addConnection(fromId, toId, fromPos, toPos, readonly = false) {
      const conn = {
        source: {
          id: fromId,
          position: fromPos,
        },
        destination: {
          id: toId,
          position: toPos,
        },
        type: "pass",
        readonly,
      };
      this.$refs.chart.internalConnections.push(conn);
      this.$emit(
        "connect",
        conn,
        this.$refs.chart.internalNodes,
        this.$refs.chart.internalConnections
      );
    },
    clearAll() {
      this.countryNode = null;
      this.$refs.chart.internalNodes = [];
      this.$refs.chart.internalConnections = [];
    },
  },
};
</script>
