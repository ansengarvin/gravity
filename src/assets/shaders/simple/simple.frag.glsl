#version 300 es

layout(location=0) out highp vec4 fragColor;
layout(location=1) out highp vec4 brightColor;

void main(void) {
    fragColor = vec4(1.0, 1.0, 1.0, 1.0);
    brightColor = vec4(0.0, 0.0, 0.0, 0.0);
}
