/**
 * Pulse Badge Embed Script
 * Spec: REQ-026
 *
 * Lightweight JavaScript loader for embedding Pulse badges on external sites.
 * Self-contained with no external dependencies.
 *
 * Usage:
 * <script src="https://pulse.localgenius.com/badges/badge-embed.js"
 *         data-pulse-id="abc123"
 *         data-theme="light"
 *         data-size="medium"
 *         data-api-base="https://staging.pulse.localgenius.com"></script>
 *
 * Attributes:
 * - data-pulse-id (required): The unique badge identifier
 * - data-theme (optional): "light" or "dark" (default: "light")
 * - data-size (optional): "small", "medium", or "large" (default: "medium")
 * - data-api-base (optional): Override API base URL for staging/dev environments
 *                             (default: "https://pulse.localgenius.com")
 */

(function () {
  "use strict";

  // Configuration
  // API_BASE can be overridden via data-api-base attribute on the script tag
  // or falls back to the production URL
  var currentScript = document.currentScript || (function() {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();
  var API_BASE = currentScript.getAttribute('data-api-base') || "https://pulse.localgenius.com";
  var BADGE_ENDPOINT = "/api/badges/";

  // Size configurations
  var SIZES = {
    small: { width: 180, height: 80 },
    medium: { width: 240, height: 100 },
    large: { width: 320, height: 130 },
  };

  /**
   * Find all Pulse badge scripts on the page
   */
  function findBadgeScripts() {
    var scripts = document.querySelectorAll(
      'script[data-pulse-id][src*="badge-embed"]'
    );
    return Array.prototype.slice.call(scripts);
  }

  /**
   * Create badge container element
   */
  function createContainer(script, size) {
    var container = document.createElement("div");
    container.className = "pulse-badge-container";
    container.style.display = "inline-block";
    container.style.width = SIZES[size].width + "px";
    container.style.height = SIZES[size].height + "px";

    // Insert after script tag
    script.parentNode.insertBefore(container, script.nextSibling);

    return container;
  }

  /**
   * Create loading placeholder
   */
  function createLoader(container, theme) {
    var bgColor = theme === "dark" ? "#1f2937" : "#f3f4f6";
    var loader = document.createElement("div");
    loader.className = "pulse-badge-loader";
    loader.style.cssText =
      "width: 100%; height: 100%; background: " +
      bgColor +
      "; border-radius: 12px; display: flex; align-items: center; justify-content: center;";
    loader.innerHTML =
      '<svg width="24" height="24" viewBox="0 0 24 24" style="animation: pulse-spin 1s linear infinite;"><circle cx="12" cy="12" r="10" stroke="#9ca3af" stroke-width="3" fill="none" stroke-dasharray="31.4 31.4" stroke-linecap="round"/></svg>';

    container.appendChild(loader);

    // Add animation keyframes
    if (!document.getElementById("pulse-badge-styles")) {
      var style = document.createElement("style");
      style.id = "pulse-badge-styles";
      style.textContent =
        "@keyframes pulse-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }";
      document.head.appendChild(style);
    }

    return loader;
  }

  /**
   * Fetch badge data from API
   */
  function fetchBadgeData(pulseId, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", API_BASE + BADGE_ENDPOINT + encodeURIComponent(pulseId));
    xhr.setRequestHeader("Accept", "application/json");

    xhr.onload = function () {
      if (xhr.status === 200) {
        try {
          var data = JSON.parse(xhr.responseText);
          callback(null, data);
        } catch (e) {
          callback(new Error("Invalid response"));
        }
      } else {
        callback(new Error("Failed to load badge: " + xhr.status));
      }
    };

    xhr.onerror = function () {
      callback(new Error("Network error"));
    };

    xhr.send();
  }

  /**
   * Get tier label based on percentile
   */
  function getTierLabel(percentile) {
    if (percentile >= 90) return "Top 10%";
    if (percentile >= 75) return "Top 25%";
    if (percentile >= 50) return "Above Average";
    return "Rising";
  }

  /**
   * Get tier color based on percentile and theme
   */
  function getTierColor(percentile, theme) {
    var isLight = theme === "light";
    if (percentile >= 90) return isLight ? "#059669" : "#34d399";
    if (percentile >= 75) return isLight ? "#2563eb" : "#60a5fa";
    if (percentile >= 50) return isLight ? "#d97706" : "#fbbf24";
    return isLight ? "#6b7280" : "#9ca3af";
  }

  /**
   * Format date for display
   */
  function formatDate(dateString) {
    var date = new Date(dateString);
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[date.getMonth()] + " " + date.getFullYear();
  }

  /**
   * Truncate business name
   */
  function truncateName(name, maxLength) {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength - 3) + "...";
  }

  /**
   * Render badge SVG
   */
  function renderBadge(container, data, theme, size) {
    var sizeConfig = SIZES[size] || SIZES.medium;
    var width = sizeConfig.width;
    var height = sizeConfig.height;
    var fontSize = size === "small" ? 24 : size === "large" ? 42 : 32;
    var logoSize = size === "small" ? 14 : size === "large" ? 20 : 16;

    var bgColor = theme === "dark" ? "#1f2937" : "#ffffff";
    var borderColor = theme === "dark" ? "#374151" : "#e5e7eb";
    var textColor = theme === "dark" ? "#e5e7eb" : "#374151";
    var subtextColor = theme === "dark" ? "#9ca3af" : "#6b7280";
    var accentColor = getTierColor(data.percentile, theme);

    var tierLabel = getTierLabel(data.percentile);
    var formattedDate = formatDate(data.calculatedAt);
    var displayName = truncateName(data.businessName, 25);

    // Build SVG
    var svg = [
      '<svg width="' +
        width +
        '" height="' +
        height +
        '" viewBox="0 0 ' +
        width +
        " " +
        height +
        '" xmlns="http://www.w3.org/2000/svg">',

      // Background
      '<rect width="' +
        width +
        '" height="' +
        height +
        '" rx="12" fill="' +
        bgColor +
        '" stroke="' +
        borderColor +
        '" stroke-width="2"/>',

      // Pulse logo
      '<text x="16" y="' +
        (logoSize + 12) +
        '" font-size="' +
        logoSize +
        '" font-weight="700" fill="' +
        accentColor +
        '" font-family="system-ui, -apple-system, sans-serif">PULSE</text>',

      // Verified badge
      '<circle cx="' +
        (width - 20) +
        '" cy="20" r="10" fill="' +
        accentColor +
        '"/>',
      '<path d="M' +
        (width - 24) +
        " 20l3 3 5-6\" stroke=\"" +
        bgColor +
        '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    ];

    if (data.insufficientData) {
      // Insufficient data display
      svg.push(
        '<text x="' +
          width / 2 +
          '" y="' +
          (height / 2 + 5) +
          '" font-size="' +
          fontSize * 0.5 +
          '" font-weight="600" fill="' +
          subtextColor +
          '" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif">Benchmark Pending</text>'
      );
    } else {
      // Percentile display
      svg.push(
        '<text x="16" y="' +
          (height / 2 + fontSize / 3) +
          '" font-size="' +
          fontSize +
          '" font-weight="700" fill="' +
          accentColor +
          '" font-family="system-ui, -apple-system, sans-serif">' +
          data.percentile +
          '<tspan font-size="' +
          fontSize * 0.5 +
          '" dy="-8">th</tspan></text>'
      );

      // Percentile label
      var labelX = 90 + (size === "small" ? -20 : size === "large" ? 30 : 0);
      svg.push(
        '<text x="' +
          labelX +
          '" y="' +
          (height / 2 + 5) +
          '" font-size="' +
          fontSize * 0.35 +
          '" font-weight="500" fill="' +
          textColor +
          '" font-family="system-ui, -apple-system, sans-serif">percentile</text>'
      );

      // Tier badge
      var tierX = width - 80 - (size === "large" ? 20 : 0);
      var tierWidth = 70 + (size === "large" ? 20 : 0);
      svg.push(
        '<rect x="' +
          tierX +
          '" y="' +
          (height / 2 - 12) +
          '" width="' +
          tierWidth +
          '" height="24" rx="12" fill="' +
          accentColor +
          '" fill-opacity="0.15"/>'
      );
      svg.push(
        '<text x="' +
          (width - 45 - (size === "large" ? 10 : 0)) +
          '" y="' +
          (height / 2 + 5) +
          '" font-size="' +
          fontSize * 0.3 +
          '" font-weight="600" fill="' +
          accentColor +
          '" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif">' +
          tierLabel +
          "</text>"
      );
    }

    // Business name
    svg.push(
      '<text x="16" y="' +
        (height - 16) +
        '" font-size="' +
        fontSize * 0.3 +
        '" font-weight="500" fill="' +
        textColor +
        '" font-family="system-ui, -apple-system, sans-serif">' +
        displayName +
        "</text>"
    );

    // Calculation date
    svg.push(
      '<text x="' +
        (width - 16) +
        '" y="' +
        (height - 16) +
        '" font-size="' +
        fontSize * 0.25 +
        '" fill="' +
        subtextColor +
        '" text-anchor="end" font-family="system-ui, -apple-system, sans-serif">' +
        formattedDate +
        "</text>"
    );

    svg.push("</svg>");

    // Update container
    container.innerHTML = "";

    if (data.reportUrl) {
      var link = document.createElement("a");
      link.href = data.reportUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.innerHTML = svg.join("");
      link.style.display = "inline-block";
      link.title = "View full Pulse report for " + data.businessName;
      container.appendChild(link);
    } else {
      container.innerHTML = svg.join("");
    }
  }

  /**
   * Render error state
   */
  function renderError(container, message, theme) {
    var bgColor = theme === "dark" ? "#1f2937" : "#fef2f2";
    var textColor = theme === "dark" ? "#fca5a5" : "#991b1b";

    container.innerHTML =
      '<div style="width: 100%; height: 100%; background: ' +
      bgColor +
      "; border-radius: 12px; display: flex; align-items: center; justify-content: center; padding: 16px; box-sizing: border-box;\">" +
      '<span style="color: ' +
      textColor +
      '; font-size: 14px; font-family: system-ui, -apple-system, sans-serif; text-align: center;">' +
      message +
      "</span></div>";
  }

  /**
   * Initialize a single badge
   */
  function initBadge(script) {
    var pulseId = script.getAttribute("data-pulse-id");
    var theme = script.getAttribute("data-theme") || "light";
    var size = script.getAttribute("data-size") || "medium";

    if (!pulseId) {
      console.error("Pulse Badge: Missing data-pulse-id attribute");
      return;
    }

    // Validate theme and size
    if (theme !== "light" && theme !== "dark") theme = "light";
    if (!SIZES[size]) size = "medium";

    // Create container and show loader
    var container = createContainer(script, size);
    createLoader(container, theme);

    // Fetch and render badge
    fetchBadgeData(pulseId, function (error, data) {
      if (error) {
        renderError(container, "Unable to load badge", theme);
        return;
      }
      renderBadge(container, data, theme, size);
    });
  }

  /**
   * Initialize all badges on page
   */
  function init() {
    var scripts = findBadgeScripts();
    scripts.forEach(initBadge);
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Expose API for programmatic use
  window.PulseBadge = {
    init: init,
    refresh: function (pulseId) {
      // Re-fetch and render a specific badge
      var containers = document.querySelectorAll(
        '[data-pulse-id="' + pulseId + '"] + .pulse-badge-container'
      );
      containers.forEach(function (container) {
        var script = container.previousElementSibling;
        if (script) {
          var theme = script.getAttribute("data-theme") || "light";
          var size = script.getAttribute("data-size") || "medium";
          createLoader(container, theme);
          fetchBadgeData(pulseId, function (error, data) {
            if (error) {
              renderError(container, "Unable to load badge", theme);
              return;
            }
            renderBadge(container, data, theme, size);
          });
        }
      });
    },
  };
})();
