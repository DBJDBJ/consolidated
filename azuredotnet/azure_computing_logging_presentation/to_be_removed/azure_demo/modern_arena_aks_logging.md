
## Modern AKS Demo Architecture

 [Simpler App based on Azure Kubernetes Service (AKS)](https://docs.microsoft.com/en-us/azure/architecture/reference-architectures/containers/aks-microservices/aks-microservices)

<img src="https://docs.microsoft.com/en-us/azure/architecture/reference-architectures/containers/aks-microservices/images/aks.png" width="50%" />

<!-- https://docs.microsoft.com/en-us/azure/architecture/reference-architectures/containers/aks-microservices/aks-microservices -->

AKS Demo Architecture is much simplified version of the above.

![](azure_demo_arch.png)

NGINX image is light, mature and proven. It emits a lot of monitoring and logging data by default. One can also execute the shell inside it.

[Azure Container Insights ](https://docs.microsoft.com/en-us/azure/azure-monitor/containers/container-insights-overview)is the critical AKS feature that needs to be setup and administered.

