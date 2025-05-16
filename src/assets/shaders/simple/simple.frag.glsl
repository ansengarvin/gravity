#version 300 es

layout(location=0) out highp vec4 fragColor;
layout(location=1) out highp vec4 brightColor;

uniform highp vec4 uFragColor;

void main(void) {
    fragColor = uFragColor;
    brightColor = vec4(0.0, 0.0, 0.0, 0.0);
}
