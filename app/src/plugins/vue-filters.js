import Vue from "vue";
import moment from "moment";
Vue.filter("money", function (value) {
  if (!value) return "AED 0.00";
  return "AED " + value.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
});

Vue.filter("assetURL", function (value) {
  if (!value) return "";
  return (
    process.env.VUE_APP_API_BASE_URL +
    value +
    "?subscription_key=" +
    process.env.VUE_APP_SUBSCRIPTION_KEY +
    "&clickdnaenv=" +
    process.env.VUE_APP_CLICKDNAENV.toLowerCase()
  );
});

Vue.filter("jsonBeautify", function (json) {
  if (!json) return "";
  json = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\\-]?\d+)?)/g,
    function (match) {
      var cls = "number";
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "key";
        } else {
          cls = "string";
        }
      } else if (/true|false/.test(match)) {
        cls = "boolean";
      } else if (/null/.test(match)) {
        cls = "null";
      }
      return '<span class="' + cls + '">' + match + "</span>";
    }
  );
});

Vue.filter("localMoment", function (date, format) {
  return moment.utc(date).local().format(format);
});

Vue.filter("ucfirst", function (value) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
});

Vue.filter("numFormat", function (value) {
  if (!value) return "0";
  return new Intl.NumberFormat("en-IN", { maximumSignificantDigits: 3 }).format(
    +value
  );
});

Vue.filter("money", function (value) {
  if (!value) return "0.00";
  return value.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
});
