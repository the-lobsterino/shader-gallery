Shader "Disconnect/Fracal/EZSleepV2.0" {
	Properties {
		[Header(Disconnect Its Really Baka)] _Speed ("Lines", Float) = 1
		_Speed2 ("Speed", Float) = 1
		[Space(5)] [HDR] _Color ("Main Color", Vector) = (0,0,0,1)
		_Color1 ("Green | Pink", Range(0, 1)) = 0.15
		_Color2 ("Blue | Yellow", Range(0, 1)) = 0.3
	}
	SubShader {
		Tags { "FORCENOSHADOWCASTING" = "true" "IGNOREPROJECTOR" = "true" "IsEmissive" = "true" "PreviewType" = "Overlay" "QUEUE" = "Overlay+28767" "RenderType" = "Overlay" }
		Pass {
			Tags { "FORCENOSHADOWCASTING" = "true" "IGNOREPROJECTOR" = "true" "IsEmissive" = "true" "PreviewType" = "Overlay" "QUEUE" = "Overlay+28767" "RenderType" = "Overlay" }
			ZTest Always
			ZWrite Off
			Cull Off
			GpuProgramID 58207
			Program "vp" {
				SubProgram "d3d11 " {
					"vs_4_0
					
					#version 330
					#extension GL_ARB_explicit_attrib_location : require
					#extension GL_ARB_explicit_uniform_location : require
					
					layout(std140) uniform UnityPerDraw {
						mat4x4 unity_ObjectToWorld;
						vec4 unused_0_1[7];
					};
					layout(std140) uniform UnityPerFrame {
						vec4 unused_1_0[17];
						mat4x4 unity_MatrixVP;
						vec4 unused_1_2[2];
					};
					in  vec4 in_POSITION0;
					out vec4 vs_TEXCOORD0;
					vec4 u_xlat0;
					vec4 u_xlat1;
					void main()
					{
					    u_xlat0 = in_POSITION0.yyyy * unity_ObjectToWorld[1];
					    u_xlat0 = unity_ObjectToWorld[0] * in_POSITION0.xxxx + u_xlat0;
					    u_xlat0 = unity_ObjectToWorld[2] * in_POSITION0.zzzz + u_xlat0;
					    u_xlat0 = u_xlat0 + unity_ObjectToWorld[3];
					    u_xlat1 = u_xlat0.yyyy * unity_MatrixVP[1];
					    u_xlat1 = unity_MatrixVP[0] * u_xlat0.xxxx + u_xlat1;
					    u_xlat1 = unity_MatrixVP[2] * u_xlat0.zzzz + u_xlat1;
					    u_xlat0 = unity_MatrixVP[3] * u_xlat0.wwww + u_xlat1;
					    u_xlat1.xyz = u_xlat0.xwy * vec3(0.5, 0.5, -0.5);
					    vs_TEXCOORD0.xy = u_xlat1.yy + u_xlat1.xz;
					    vs_TEXCOORD0.zw = u_xlat0.zw;
					    gl_Position = u_xlat0;
					    return;
					}"
				}
				SubProgram "d3d11 " {
					Keywords { "UNITY_SINGLE_PASS_STEREO" }
					"vs_4_0
					
					#version 330
					#extension GL_ARB_explicit_attrib_location : require
					#extension GL_ARB_explicit_uniform_location : require
					
					layout(std140) uniform UnityPerDraw {
						mat4x4 unity_ObjectToWorld;
						vec4 unused_0_1[7];
					};
					layout(std140) uniform UnityStereoGlobals {
						vec4 unused_1_0[24];
						mat4x4 unity_StereoMatrixVP[2];
						vec4 unused_1_2[38];
						vec4 unity_StereoScaleOffset[2];
						vec4 unused_1_4;
					};
					layout(std140) uniform UnityStereoEyeIndex {
						int unity_StereoEyeIndex;
					};
					in  vec4 in_POSITION0;
					out vec4 vs_TEXCOORD0;
					vec4 u_xlat0;
					vec3 u_xlat1;
					int u_xlati1;
					vec4 u_xlat2;
					int u_xlati7;
					void main()
					{
					    u_xlat0 = in_POSITION0.yyyy * unity_ObjectToWorld[1];
					    u_xlat0 = unity_ObjectToWorld[0] * in_POSITION0.xxxx + u_xlat0;
					    u_xlat0 = unity_ObjectToWorld[2] * in_POSITION0.zzzz + u_xlat0;
					    u_xlat0 = u_xlat0 + unity_ObjectToWorld[3];
					    u_xlati1 = unity_StereoEyeIndex << 2;
					    u_xlat2 = u_xlat0.yyyy * unity_StereoMatrixVP[(u_xlati1 + 1) / 4][(u_xlati1 + 1) % 4];
					    u_xlat2 = unity_StereoMatrixVP[u_xlati1 / 4][u_xlati1 % 4] * u_xlat0.xxxx + u_xlat2;
					    u_xlat2 = unity_StereoMatrixVP[(u_xlati1 + 2) / 4][(u_xlati1 + 2) % 4] * u_xlat0.zzzz + u_xlat2;
					    u_xlat0 = unity_StereoMatrixVP[(u_xlati1 + 3) / 4][(u_xlati1 + 3) % 4] * u_xlat0.wwww + u_xlat2;
					    u_xlat1.xyz = u_xlat0.xwy * vec3(0.5, 0.5, -0.5);
					    u_xlat1.xy = u_xlat1.yy + u_xlat1.xz;
					    u_xlati7 = unity_StereoEyeIndex;
					    u_xlat2.xy = u_xlat0.ww * unity_StereoScaleOffset[u_xlati7].zw;
					    vs_TEXCOORD0.xy = u_xlat1.xy * unity_StereoScaleOffset[u_xlati7].xy + u_xlat2.xy;
					    vs_TEXCOORD0.zw = u_xlat0.zw;
					    gl_Position = u_xlat0;
					    return;
					}"
				}
			}
			Program "fp" {
				SubProgram "d3d11 " {
					"ps_4_0
					
					#version 330
					#extension GL_ARB_explicit_attrib_location : require
					#extension GL_ARB_explicit_uniform_location : require
					
					layout(std140) uniform PGlobals {
						vec4 unused_0_0[2];
						float _Speed;
						float _Speed2;
						vec3 _Color;
						float _Color1;
						float _Color2;
					};
					layout(std140) uniform UnityPerCamera {
						vec4 _Time;
						vec4 unused_1_1[8];
					};
					in  vec4 vs_TEXCOORD0;
					layout(location = 0) out vec4 SV_Target0;
					vec3 u_xlat0;
					vec3 u_xlat1;
					bool u_xlatb1;
					vec3 u_xlat2;
					float u_xlat3;
					bool u_xlatb3;
					float u_xlat4;
					float u_xlat6;
					bool u_xlatb6;
					void main()
					{
					    u_xlat0.xy = vs_TEXCOORD0.xy / vs_TEXCOORD0.ww;
					    u_xlat0.xy = u_xlat0.xy * vec2(2.0, 2.0) + vec2(-1.0, -1.0);
					    u_xlat4 = max(abs(u_xlat0.y), abs(u_xlat0.x));
					    u_xlat4 = float(1.0) / u_xlat4;
					    u_xlat6 = min(abs(u_xlat0.y), abs(u_xlat0.x));
					    u_xlat4 = u_xlat4 * u_xlat6;
					    u_xlat6 = u_xlat4 * u_xlat4;
					    u_xlat1.x = u_xlat6 * 0.0208350997 + -0.0851330012;
					    u_xlat1.x = u_xlat6 * u_xlat1.x + 0.180141002;
					    u_xlat1.x = u_xlat6 * u_xlat1.x + -0.330299497;
					    u_xlat6 = u_xlat6 * u_xlat1.x + 0.999866009;
					    u_xlat1.x = u_xlat6 * u_xlat4;
					    u_xlat1.x = u_xlat1.x * -2.0 + 1.57079637;
					    u_xlatb3 = abs(u_xlat0.y)<abs(u_xlat0.x);
					    u_xlat1.x = u_xlatb3 ? u_xlat1.x : float(0.0);
					    u_xlat4 = u_xlat4 * u_xlat6 + u_xlat1.x;
					    u_xlatb6 = u_xlat0.y<(-u_xlat0.y);
					    u_xlat6 = u_xlatb6 ? -3.14159274 : float(0.0);
					    u_xlat4 = u_xlat6 + u_xlat4;
					    u_xlat6 = min(u_xlat0.y, u_xlat0.x);
					    u_xlatb6 = u_xlat6<(-u_xlat6);
					    u_xlat1.x = max(u_xlat0.y, u_xlat0.x);
					    u_xlat0.x = dot(u_xlat0.xy, u_xlat0.xy);
					    u_xlat0.x = log2(u_xlat0.x);
					    u_xlat0.x = u_xlat0.x * _Speed;
					    u_xlatb1 = u_xlat1.x>=(-u_xlat1.x);
					    u_xlatb6 = u_xlatb6 && u_xlatb1;
					    u_xlat0.z = (u_xlatb6) ? (-u_xlat4) : u_xlat4;
					    u_xlat0.xyz = u_xlat0.xxz * vec3(0.693147182, 0.0346573591, 0.318309873);
					    u_xlat6 = _Time.y * 0.25;
					    u_xlat6 = fract(u_xlat6);
					    u_xlat1.x = u_xlat6 * _Speed2;
					    u_xlat2.x = u_xlat6 * _Speed2 + u_xlat0.y;
					    u_xlat2.x = fract(u_xlat2.x);
					    u_xlat2.z = fract(u_xlat1.x);
					    u_xlat2.xz = u_xlat2.xz + vec2(-0.5, -0.5);
					    u_xlat1.x = abs(u_xlat2.z) + abs(u_xlat2.z);
					    u_xlat6 = abs(u_xlat2.z) * 12.0 + -15.0;
					    u_xlat6 = u_xlat1.x * u_xlat6 + 10.0;
					    u_xlat3 = u_xlat1.x * u_xlat1.x;
					    u_xlat1.x = u_xlat1.x * u_xlat3;
					    u_xlat6 = u_xlat1.x * u_xlat6 + 1.0;
					    u_xlat0.x = u_xlat0.x * u_xlat6 + u_xlat0.z;
					    u_xlat4 = abs(u_xlat2.x) * 12.0 + -15.0;
					    u_xlat2.x = abs(u_xlat2.x) + abs(u_xlat2.x);
					    u_xlat4 = u_xlat2.x * u_xlat4 + 10.0;
					    u_xlat6 = u_xlat2.x * u_xlat2.x;
					    u_xlat2.x = u_xlat2.x * u_xlat6;
					    u_xlat2.x = u_xlat4 * u_xlat2.x;
					    u_xlat0.x = u_xlat2.x * 5.0 + u_xlat0.x;
					    u_xlat2.x = u_xlat0.x + _Color1;
					    u_xlat2.x = fract(u_xlat2.x);
					    u_xlat2.x = u_xlat2.x + -0.5;
					    u_xlat4 = abs(u_xlat2.x) + abs(u_xlat2.x);
					    u_xlat2.x = abs(u_xlat2.x) * 12.0 + -15.0;
					    u_xlat2.x = u_xlat4 * u_xlat2.x + 10.0;
					    u_xlat6 = u_xlat4 * u_xlat4;
					    u_xlat4 = u_xlat4 * u_xlat6;
					    u_xlat1.y = u_xlat2.x * u_xlat4;
					    u_xlat0.y = u_xlat0.x + _Color2;
					    u_xlat0.xy = fract(u_xlat0.xy);
					    u_xlat0.xy = u_xlat0.xy + vec2(-0.5, -0.5);
					    u_xlat4 = abs(u_xlat0.y) + abs(u_xlat0.y);
					    u_xlat2.x = abs(u_xlat0.y) * 12.0 + -15.0;
					    u_xlat2.x = u_xlat4 * u_xlat2.x + 10.0;
					    u_xlat6 = u_xlat4 * u_xlat4;
					    u_xlat4 = u_xlat4 * u_xlat6;
					    u_xlat1.z = u_xlat2.x * u_xlat4;
					    u_xlat2.x = abs(u_xlat0.x) * 12.0 + -15.0;
					    u_xlat0.x = abs(u_xlat0.x) + abs(u_xlat0.x);
					    u_xlat2.x = u_xlat0.x * u_xlat2.x + 10.0;
					    u_xlat4 = u_xlat0.x * u_xlat0.x;
					    u_xlat0.x = u_xlat0.x * u_xlat4;
					    u_xlat1.x = u_xlat2.x * u_xlat0.x;
					    SV_Target0.xyz = u_xlat1.xyz * _Color.xyz;
					    SV_Target0.w = 1.0;
					    return;
					}"
				}
				SubProgram "d3d11 " {
					Keywords { "UNITY_SINGLE_PASS_STEREO" }
					"ps_4_0
					
					#version 330
					#extension GL_ARB_explicit_attrib_location : require
					#extension GL_ARB_explicit_uniform_location : require
					
					layout(std140) uniform PGlobals {
						vec4 unused_0_0[2];
						float _Speed;
						float _Speed2;
						vec3 _Color;
						float _Color1;
						float _Color2;
					};
					layout(std140) uniform UnityPerCamera {
						vec4 _Time;
						vec4 unused_1_1[7];
					};
					in  vec4 vs_TEXCOORD0;
					layout(location = 0) out vec4 SV_Target0;
					vec3 u_xlat0;
					vec3 u_xlat1;
					bool u_xlatb1;
					vec3 u_xlat2;
					float u_xlat3;
					bool u_xlatb3;
					float u_xlat4;
					float u_xlat6;
					bool u_xlatb6;
					void main()
					{
					    u_xlat0.xy = vs_TEXCOORD0.xy / vs_TEXCOORD0.ww;
					    u_xlat0.xy = u_xlat0.xy * vec2(2.0, 2.0) + vec2(-1.0, -1.0);
					    u_xlat4 = max(abs(u_xlat0.y), abs(u_xlat0.x));
					    u_xlat4 = float(1.0) / u_xlat4;
					    u_xlat6 = min(abs(u_xlat0.y), abs(u_xlat0.x));
					    u_xlat4 = u_xlat4 * u_xlat6;
					    u_xlat6 = u_xlat4 * u_xlat4;
					    u_xlat1.x = u_xlat6 * 0.0208350997 + -0.0851330012;
					    u_xlat1.x = u_xlat6 * u_xlat1.x + 0.180141002;
					    u_xlat1.x = u_xlat6 * u_xlat1.x + -0.330299497;
					    u_xlat6 = u_xlat6 * u_xlat1.x + 0.999866009;
					    u_xlat1.x = u_xlat6 * u_xlat4;
					    u_xlat1.x = u_xlat1.x * -2.0 + 1.57079637;
					    u_xlatb3 = abs(u_xlat0.y)<abs(u_xlat0.x);
					    u_xlat1.x = u_xlatb3 ? u_xlat1.x : float(0.0);
					    u_xlat4 = u_xlat4 * u_xlat6 + u_xlat1.x;
					    u_xlatb6 = u_xlat0.y<(-u_xlat0.y);
					    u_xlat6 = u_xlatb6 ? -3.14159274 : float(0.0);
					    u_xlat4 = u_xlat6 + u_xlat4;
					    u_xlat6 = min(u_xlat0.y, u_xlat0.x);
					    u_xlatb6 = u_xlat6<(-u_xlat6);
					    u_xlat1.x = max(u_xlat0.y, u_xlat0.x);
					    u_xlat0.x = dot(u_xlat0.xy, u_xlat0.xy);
					    u_xlat0.x = log2(u_xlat0.x);
					    u_xlat0.x = u_xlat0.x * _Speed;
					    u_xlatb1 = u_xlat1.x>=(-u_xlat1.x);
					    u_xlatb6 = u_xlatb6 && u_xlatb1;
					    u_xlat0.z = (u_xlatb6) ? (-u_xlat4) : u_xlat4;
					    u_xlat0.xyz = u_xlat0.xxz * vec3(0.693147182, 0.0346573591, 0.318309873);
					    u_xlat6 = _Time.y * 0.25;
					    u_xlat6 = fract(u_xlat6);
					    u_xlat1.x = u_xlat6 * _Speed2;
					    u_xlat2.x = u_xlat6 * _Speed2 + u_xlat0.y;
					    u_xlat2.x = fract(u_xlat2.x);
					    u_xlat2.z = fract(u_xlat1.x);
					    u_xlat2.xz = u_xlat2.xz + vec2(-0.5, -0.5);
					    u_xlat1.x = abs(u_xlat2.z) + abs(u_xlat2.z);
					    u_xlat6 = abs(u_xlat2.z) * 12.0 + -15.0;
					    u_xlat6 = u_xlat1.x * u_xlat6 + 10.0;
					    u_xlat3 = u_xlat1.x * u_xlat1.x;
					    u_xlat1.x = u_xlat1.x * u_xlat3;
					    u_xlat6 = u_xlat1.x * u_xlat6 + 1.0;
					    u_xlat0.x = u_xlat0.x * u_xlat6 + u_xlat0.z;
					    u_xlat4 = abs(u_xlat2.x) * 12.0 + -15.0;
					    u_xlat2.x = abs(u_xlat2.x) + abs(u_xlat2.x);
					    u_xlat4 = u_xlat2.x * u_xlat4 + 10.0;
					    u_xlat6 = u_xlat2.x * u_xlat2.x;
					    u_xlat2.x = u_xlat2.x * u_xlat6;
					    u_xlat2.x = u_xlat4 * u_xlat2.x;
					    u_xlat0.x = u_xlat2.x * 5.0 + u_xlat0.x;
					    u_xlat2.x = u_xlat0.x + _Color1;
					    u_xlat2.x = fract(u_xlat2.x);
					    u_xlat2.x = u_xlat2.x + -0.5;
					    u_xlat4 = abs(u_xlat2.x) + abs(u_xlat2.x);
					    u_xlat2.x = abs(u_xlat2.x) * 12.0 + -15.0;
					    u_xlat2.x = u_xlat4 * u_xlat2.x + 10.0;
					    u_xlat6 = u_xlat4 * u_xlat4;
					    u_xlat4 = u_xlat4 * u_xlat6;
					    u_xlat1.y = u_xlat2.x * u_xlat4;
					    u_xlat0.y = u_xlat0.x + _Color2;
					    u_xlat0.xy = fract(u_xlat0.xy);
					    u_xlat0.xy = u_xlat0.xy + vec2(-0.5, -0.5);
					    u_xlat4 = abs(u_xlat0.y) + abs(u_xlat0.y);
					    u_xlat2.x = abs(u_xlat0.y) * 12.0 + -15.0;
					    u_xlat2.x = u_xlat4 * u_xlat2.x + 10.0;
					    u_xlat6 = u_xlat4 * u_xlat4;
					    u_xlat4 = u_xlat4 * u_xlat6;
					    u_xlat1.z = u_xlat2.x * u_xlat4;
					    u_xlat2.x = abs(u_xlat0.x) * 12.0 + -15.0;
					    u_xlat0.x = abs(u_xlat0.x) + abs(u_xlat0.x);
					    u_xlat2.x = u_xlat0.x * u_xlat2.x + 10.0;
					    u_xlat4 = u_xlat0.x * u_xlat0.x;
					    u_xlat0.x = u_xlat0.x * u_xlat4;
					    u_xlat1.x = u_xlat2.x * u_xlat0.x;
					    SV_Target0.xyz = u_xlat1.xyz * _Color.xyz;
					    SV_Target0.w = 1.0;
					    return;
					}"
				}
			}
		
	
