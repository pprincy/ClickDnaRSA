<template>
  <div v-if="legendType === 'package'">
    <p>
      <strong>Created:</strong><br />
      Package Details are Uploaded to ClickDNA You can modify details.
    </p>
    <p>
      <strong>In Planning:</strong><br />
      Package Movement Planning Started. You can not modify details now.
    </p>
    <p>
      <strong>Exceptions:</strong><br />
      Exception got when movement is planning for Package
    </p>
    <p>
      <strong>Movement Planned:</strong><br />
      Package Movement Planned and details are ready to Transfer to LMC
    </p>
    <p>
      <strong>Transferred to LMC:</strong><br />
      Package Details are submitted to Last Mile Carrier and ready to dispatch.
    </p>
    <p>
      <strong>In Transit:</strong><br />
      Package Movement started from origin location to destination location
    </p>
    <p>
      <strong>Done:</strong><br />
      Package Movement Completed
    </p>
  </div>
  <div v-else-if="legendType === 'bag'">
    <p>
      <strong>Created:</strong><br />
      New Bag Created
    </p>
    <p>
      <strong>Planned:</strong><br />
      Bag with Consignments are planned (Can edit bag consignments)
    </p>
    <p>
      <strong>Finalized:</strong><br />
      Bag with consignments are finalized (No edit allowed)
    </p>
    <p>
      <strong>In Transit:</strong><br />
      Bag with consignments are in Transit to Destination
    </p>
    <p>
      <strong>Done:</strong><br />
      Transit Movement Complete
    </p>
  </div>
  <div v-else-if="legendType === 'consolidation'">
    <p>
      <strong>Consolidated:</strong><br />
      Draft Consolidation Created with mapped bags
    </p>
    <p>
      <strong>Finalized:</strong><br />
      Consolidation Finalized and associated bags are also auto Finalized
    </p>
    <p>
      <strong>Received:</strong><br />
      Consolidated Bags are received at Transit Agent Location
    </p>
    <p>
      <strong>Partial Manifested:</strong><br />
      Transit Agent Partially Manifested Bags and consignments
    </p>
    <p>
      <strong>Manifested:</strong><br />
      Transit Agent fully Manifested bags and consignments
    </p>
  </div>
  <div v-else-if="legendType === 'sellers'">
    <p v-for="(item, i) of statusList" :key="i">
      <strong>{{ item.value }}:</strong><br />
      {{ item.description }}
    </p>
  </div>
</template>
<script>
export default {
  props: {
    legendType: {
      type: String,
      default: "package",
    },
    statusList: {
      type: Array,
      default: () => [],
    },
  },
};
</script>
