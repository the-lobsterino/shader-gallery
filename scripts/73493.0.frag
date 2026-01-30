#version 100
precision mediump float;

attribute vec3 a_position;
attribute vec2 a_texCoord0;
attribute vec3 a_normal;
attribute vec4 joint;
attribute vec4 weight;

varying vec2 v_texCoord0;
varying vec3 v_normal;

uniform mat4 u_projection;
uniform mat4 u_view;

void main() {

    gl_Position = u_projection * u_view * vec4(a_position, 1.0);
    v_texCoord0 = vec2(a_texCoord0.x, a_texCoord0.y);
    v_normal = vec3(a_normal.x, a_normal.y, a_normal.z);
    
}