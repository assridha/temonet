---
layout: page
title: Dashboard
order: 1
icon: fas fa-tachometer-alt
---

# Dashboard for Bitcoin

<style>
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50vh;
  }
  
  .loading-spinner {
    width: 5rem;
    height: 5rem;
  }
</style>



<div id="container" class="loading-container" style="background-color:#222">
  <div class="spinner-border loading-spinner" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</div>

 <script type="module">
      import { initializeCharts } from '/temonet/assets/js/plrr-tradingview.js';

        console.log('script loaded successfully')
      async function fetchData() {
        const bitcoinResponse = await fetch('https://python-server-e4a8c032b69c.herokuapp.com/bitcoin-price');
        const quantileResponse = await fetch('https://python-server-e4a8c032b69c.herokuapp.com/quantile-price');
        
        const bitcoinData = await bitcoinResponse.json();
        const quantileData = await quantileResponse.json();
        
        // Combine or process the data as needed
        return { bitcoinData, quantileData }; // Adjust this return as necessary
      }

      fetchData()
      .then(data => {
        document.getElementById('container').removeChild(document.querySelector('.loading-spinner'));
        document.getElementById('container').classList.remove('loading-container');
        initializeCharts(data.bitcoinData,data.quantileData); // Pass the combined data to initializeCharts
      });
    </script>