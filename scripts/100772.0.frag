#version 310 es
precision highp float;

layout(binding = 0, std140) uniform cbObject
{
    layout(row_major) mat4 g_mWorld;
} _43;

layout(binding = 4, std140) uniform cbView
{
    layout(row_major) mat4 g_mViewProjection;
    vec4 g_CameraPosition;
    vec4 g_textureWeights1;
    vec4 g_textureWeights2;
    vec4 g_textureWeights3;
    vec4 g_featureWeights1;
    vec4 g_featureWeights2;
    vec4 g_shadeBaseColor;
} _53;

layout(location = 0) in vec3 input_Position;
layout(location = 1) in vec3 input_Normal;
layout(location = 3) in vec4 input_Color;
layout(location = 4) in vec2 input_TextureUV0;
layout(location = 0) out vec2 _entryPointOutput_TextureUV0;
layout(location = 1) out vec3 _entryPointOutput_WorldPos;
layout(location = 2) out vec3 _entryPointOutput_WorldNormal;
layout(location = 3) out vec4 _entryPointOutput_Color;

highp mat4 spvWorkaroundRowMajor(highp mat4 wrap) { return wrap; }
mediump mat4 spvWorkaroundRowMajorMP(mediump mat4 wrap) { return wrap; }

void main()
{
    vec4 _161 = spvWorkaroundRowMajor(_43.g_mWorld) * vec4(input_Position, 1.0);
    _entryPointOutput_TextureUV0 = input_TextureUV0;
    _entryPointOutput_WorldPos = _161.xyz;
    _entryPointOutput_WorldNormal = (spvWorkaroundRowMajor(_43.g_mWorld) * vec4(input_Normal, 0.0)).xyz;
    _entryPointOutput_Color = input_Color;
}

