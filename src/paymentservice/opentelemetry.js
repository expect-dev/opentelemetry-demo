const opentelemetry = require("@opentelemetry/sdk-node")
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node")
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-grpc')
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-grpc')
const { PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics')
const { alibabaCloudEcsDetector } = require('@opentelemetry/resource-detector-alibaba-cloud')
const { awsEc2Detector, awsEksDetector } = require('@opentelemetry/resource-detector-aws')
const { containerDetector } = require('@opentelemetry/resource-detector-container')
const { gcpDetector } = require('@opentelemetry/resource-detector-gcp')
const { envDetector, hostDetector, osDetector, processDetector } = require('@opentelemetry/resources')
const { httpInstrumentationConfig } = require('./otel-custom/http');
const { expressInstrumentationConfig } = require('./otel-custom/express');

const sdk = new opentelemetry.NodeSDK({
  traceExporter: new OTLPTraceExporter(),
  instrumentations: [ getNodeAutoInstrumentations({
    '@opentelemetry/instrumentation-http': httpInstrumentationConfig,
    '@opentelemetry/instrumentation-express': expressInstrumentationConfig
  }) ],
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter()
  }),
  resourceDetectors: [
    containerDetector,
    envDetector,
    hostDetector,
    osDetector,
    processDetector,
    alibabaCloudEcsDetector,
    awsEksDetector,
    awsEc2Detector,
    gcpDetector
  ],
})

sdk.start().then(() => require("./index"));
