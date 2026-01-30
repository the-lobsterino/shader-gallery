#ifdef GL_ES
precision lowp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

#define rmouse mouse*resolution

/***********************************************
* File Name: gooch_vertex.glsl
* Author: Franklin Ludgood
* Date Created: 10-07-2016
************************************************/
precision mediump float;

//uniforms
uniform vec3 m_LightPosition;



//Uniforms
uniform mat4 g_WorldViewProjectionMatrix;
uniform mat4 g_WorldViewMatrix;
uniform mat4 g_NormalMatrix;
uniform float g_TimeElapsed;

//Atributes
attribute vec3 inPosition;
attribute vec3 inNormal;
attribute vec3 inVelocity;


varying float NdotL;
varying vec3 ReflectVec;
varying vec3 ViewVec;


vec3 UpdatePosition(){

    vec3 gravity = vec3(0.0, -10.0, 0.0);
    vec3 ans = (inVelocity * g_TimeElapsed) + (0.5 * g_TimeElapsed * g_TimeElapsed * gravity);
    return ans;
}


void main() {

    vec3 ecPos = vec3(g_WorldViewMatrix * vec4(inPosition, 1.0));
    mat3 normalMatrix = transpose(inverse(mat3(g_NormalMatrix)));
    vec3 tnorm = normalize(normalMatrix * inNormal);
    vec3 lightVec = normalize(m_LightPosition - ecPos);
    ViewVec = normalize(-ecPos);
    NdotL = (dot(lightVec, tnorm) + 1.0) * 0.5;
    vec3 currentPos;

    if(g_TimeElapsed > 0.0){
      currentPos = inPosition + UpdatePosition();
    }
    else {
       currentPos = inPosition;
    }


    // Vertex transformation
    gl_Position = g_WorldViewProjectionMatrix * vec4(currentPos, 1.0);
}