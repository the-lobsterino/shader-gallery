//////////////////////////////////////////
//
// NOTE: This is *not* a valid shader file
//
///////////////////////////////////////////
Shader "miHoYo/UI/Gacha_Galaxy" {
Properties {
_FadeValue ("FadeValue", Range(0, 2)) = 0
_BGColor ("BGColor", Color) = (0.2627451,0.5843138,0.9960785,0)
_Brightness ("Brightness", Float) = 3
_MainTex ("MainTex", 2D) = "white" { }
_StarTex ("StarTex", 2D) = "white" { }
_StarBrightness ("StarBrightness", Float) = 10
_StarDepth ("StarDepth", Float) = 14.89
_Star02Tex ("Star02Tex", 2D) = "white" { }
_Star02Brightness ("Star02Brightness", Float) = 10
_Star02Depth ("Star02Depth", Float) = 14.89
_CloudTex ("CloudTex", 2D) = "white" { }
_CloudOffset ("CloudOffset", Float) = 0
_CloudMultiplyer ("CloudMultiplyer", Float) = 11
_CloudSpeed ("CloudSpeed", Float) = 0.05
_GalaxyLightColor ("GalaxyLightColor", Color) = (0,1,0.7103448,0)
_NoiseTex ("NoiseTex", 2D) = "white" { }
_NoiseBrightness ("NoiseBrightness", Float) = 0.2
_NoiseSpeed ("NoiseSpeed", Float) = 0
_NoiseTex02 ("NoiseTex02", 2D) = "white" { }
_Noise02Offset ("Noise02Offset", Float) = -0.05
_Noise02Multipler ("Noise02Multipler", Float) = 1
_GalaxyDarkColor ("GalaxyDarkColor", Color) = (0.7379308,0,1,0)
_DarkColorMultiplyer ("DarkColorMultiplyer", Float) = 1
_Mask02 ("Mask02", 2D) = "white" { }
_ColorPalette ("ColorPalette", 2D) = "white" { }
_ColorPaletteSpeed ("ColorPaletteSpeed", Float) = -1.95
_CloudDepth ("CloudDepth", Float) = 2
_CloudScale ("CloudScale", Float) = 0.1
_Range ("Range", Float) = 1
_Offset ("Offset", Float) = 0
[Header(Cull Mode)] [Enum(UnityEngine.Rendering.CullMode)] _Cull ("Cull Mode", Float) = 2
_MHYZBias ("Z Bias", Float) = 0
_PolygonOffsetUnit ("Polygon Offset Unit", Float) = 0
_PolygonOffsetFactor ("Polygon Offset Factor", Float) = 0
[Header(Blend Mode)] [Enum(UnityEngine.Rendering.BlendMode)] _SrcBlendMode ("Src Blend Mode", Float) = 1
[Enum(UnityEngine.Rendering.BlendMode)] _DstBlendMode ("Dst Blend Mode", Float) = 0
[Enum(UnityEngine.Rendering.BlendOp)] _BlendOP ("BlendOp Mode", Float) = 0
[Header(Depth Mode)] [Enum(Off, 0, On, 1)] _Zwrite ("ZWrite Mode", Float) = 1
[Enum(UnityEngine.Rendering.CompareFunction)] _Ztest ("ZTest Mode", Float) = 4
[Header(Fog Mode)] [Toggle(EFFECTED_BY_FOG)] _EffectedByFog ("Effected by fog", Float) = 0
}
SubShader {
 Tags { "IGNOREPROJECTOR" = "true" "PreviewType" = "Plane" "QUEUE" = "Transparent" "RenderType" = "Transparent" }
 Pass {
  Tags { "IGNOREPROJECTOR" = "true" "PreviewType" = "Plane" "QUEUE" = "Transparent" "RenderType" = "Transparent" }
  Blend Zero Zero, Zero Zero
  ZTest Off
  ZWrite Off
  Cull Off
  GpuProgramID 46345
Program "vp" {
SubProgram "d3d11 " {
"// shader disassembly not supported on DXBC"
}
SubProgram "vulkan " {
"; SPIR-V
; Version: 1.0
; Generator: Khronos Glslang Reference Front End; 1
; Bound: 335
; Schema: 0
                                                      OpCapability Shader 
                                               %1 = OpExtInstImport "GLSL.std.450" 
                                                      OpMemoryModel Logical GLSL450 
                                                      OpEntryPoint Vertex %4 "main" %11 %82 %105 %106 %108 %109 %111 %112 %114 %115 %182 %230 %317 
                                                      OpDecorate %11 Location 11 
                                                      OpDecorate %17 ArrayStride 17 
                                                      OpDecorate %18 ArrayStride 18 
                                                      OpDecorate %19 ArrayStride 19 
                                                      OpMemberDecorate %20 0 Offset 20 
                                                      OpMemberDecorate %20 1 Offset 20 
                                                      OpMemberDecorate %20 2 Offset 20 
                                                      OpMemberDecorate %20 3 Offset 20 
                                                      OpMemberDecorate %20 4 Offset 20 
                                                      OpMemberDecorate %20 5 RelaxedPrecision 
                                                      OpMemberDecorate %20 5 Offset 20 
                                                      OpDecorate %20 Block 
                                                      OpDecorate %22 DescriptorSet 22 
                                                      OpDecorate %22 Binding 22 
                                                      OpMemberDecorate %80 0 BuiltIn 80 
                                                      OpMemberDecorate %80 1 BuiltIn 80 
                                                      OpMemberDecorate %80 2 BuiltIn 80 
                                                      OpDecorate %80 Block 
                                                      OpDecorate %86 RelaxedPrecision 
                                                      OpDecorate %87 RelaxedPrecision 
                                                      OpDecorate %105 Location 105 
                                                      OpDecorate %106 Location 106 
                                                      OpDecorate %108 Location 108 
                                                      OpDecorate %109 Location 109 
                                                      OpDecorate %111 Location 111 
                                                      OpDecorate %112 Location 112 
                                                      OpDecorate %114 Location 114 
                                                      OpDecorate %115 Location 115 
                                                      OpDecorate %182 Location 182 
                                                      OpDecorate %230 Location 230 
                                                      OpDecorate %317 Location 317 
                                               %2 = OpTypeVoid 
                                               %3 = OpTypeFunction %2 
                                               %6 = OpTypeFloat 32 
                                               %7 = OpTypeVector %6 4 
                                               %8 = OpTypePointer Private %7 
                                Private f32_4* %9 = OpVariable Private 
                                              %10 = OpTypePointer Input %7 
                                 Input f32_4* %11 = OpVariable Input 
                                              %14 = OpTypeVector %6 3 
                                              %15 = OpTypeInt 32 0 
                                          u32 %16 = OpConstant 4 
                                              %17 = OpTypeArray %7 %16 
                                              %18 = OpTypeArray %7 %16 
                                              %19 = OpTypeArray %7 %16 
                                              %20 = OpTypeStruct %14 %17 %18 %7 %19 %6 
                                              %21 = OpTypePointer Uniform %20 
Uniform struct {f32_3; f32_4[4]; f32_4[4]; f32_4; f32_4[4]; f32;}* %22 = OpVariable Uniform 
                                              %23 = OpTypeInt 32 1 
                                          i32 %24 = OpConstant 1 
                                              %25 = OpTypePointer Uniform %7 
                                          i32 %29 = OpConstant 0 
                                          i32 %37 = OpConstant 2 
                                          i32 %46 = OpConstant 3 
                               Private f32_4* %50 = OpVariable Private 
                                          i32 %53 = OpConstant 4 
                                          u32 %78 = OpConstant 1 
                                              %79 = OpTypeArray %6 %78 
                                              %80 = OpTypeStruct %7 %6 %79 
                                              %81 = OpTypePointer Output %80 
         Output struct {f32_4; f32; f32[1];}* %82 = OpVariable Output 
                                          i32 %83 = OpConstant 5 
                                              %84 = OpTypePointer Uniform %6 
                                          u32 %88 = OpConstant 3 
                                              %89 = OpTypePointer Private %6 
                                          u32 %93 = OpConstant 2 
                                              %97 = OpTypePointer Output %6 
                                             %101 = OpTypePointer Output %7 
                               Output f32_4* %105 = OpVariable Output 
                                Input f32_4* %106 = OpVariable Input 
                               Output f32_4* %108 = OpVariable Output 
                                Input f32_4* %109 = OpVariable Input 
                               Output f32_4* %111 = OpVariable Output 
                                Input f32_4* %112 = OpVariable Input 
                               Output f32_4* %114 = OpVariable Output 
                                Input f32_4* %115 = OpVariable Input 
                                             %161 = OpTypePointer Uniform %14 
                                Private f32* %167 = OpVariable Private 
                                Input f32_4* %182 = OpVariable Input 
                                             %227 = OpTypePointer Private %14 
                              Private f32_3* %228 = OpVariable Private 
                                             %229 = OpTypePointer Input %14 
                                Input f32_3* %230 = OpVariable Input 
                                         u32 %248 = OpConstant 0 
                              Private f32_3* %259 = OpVariable Private 
                                             %272 = OpTypePointer Input %6 
                              Private f32_3* %283 = OpVariable Private 
                               Output f32_4* %317 = OpVariable Output 
                                         f32 %328 = OpConstant 3.674022E-40 
                                          void %4 = OpFunction None %3 
                                               %5 = OpLabel 
                                        f32_4 %12 = OpLoad %11 
                                        f32_4 %13 = OpVectorShuffle %12 %12 1 1 1 1 
                               Uniform f32_4* %26 = OpAccessChain %22 %24 %24 
                                        f32_4 %27 = OpLoad %26 
                                        f32_4 %28 = OpFMul %13 %27 
                                                      OpStore %9 %28 
                               Uniform f32_4* %30 = OpAccessChain %22 %24 %29 
                                        f32_4 %31 = OpLoad %30 
                                        f32_4 %32 = OpLoad %11 
                                        f32_4 %33 = OpVectorShuffle %32 %32 0 0 0 0 
                                        f32_4 %34 = OpFMul %31 %33 
                                        f32_4 %35 = OpLoad %9 
                                        f32_4 %36 = OpFAdd %34 %35 
                                                      OpStore %9 %36 
                               Uniform f32_4* %38 = OpAccessChain %22 %24 %37 
                                        f32_4 %39 = OpLoad %38 
                                        f32_4 %40 = OpLoad %11 
                                        f32_4 %41 = OpVectorShuffle %40 %40 2 2 2 2 
                                        f32_4 %42 = OpFMul %39 %41 
                                        f32_4 %43 = OpLoad %9 
                                        f32_4 %44 = OpFAdd %42 %43 
                                                      OpStore %9 %44 
                                        f32_4 %45 = OpLoad %9 
                               Uniform f32_4* %47 = OpAccessChain %22 %24 %46 
                                        f32_4 %48 = OpLoad %47 
                                        f32_4 %49 = OpFAdd %45 %48 
                                                      OpStore %9 %49 
                                        f32_4 %51 = OpLoad %9 
                                        f32_4 %52 = OpVectorShuffle %51 %51 1 1 1 1 
                               Uniform f32_4* %54 = OpAccessChain %22 %53 %24 
                                        f32_4 %55 = OpLoad %54 
                                        f32_4 %56 = OpFMul %52 %55 
                                                      OpStore %50 %56 
                               Uniform f32_4* %57 = OpAccessChain %22 %53 %29 
                                        f32_4 %58 = OpLoad %57 
                                        f32_4 %59 = OpLoad %9 
                                        f32_4 %60 = OpVectorShuffle %59 %59 0 0 0 0 
                                        f32_4 %61 = OpFMul %58 %60 
                                        f32_4 %62 = OpLoad %50 
                                        f32_4 %63 = OpFAdd %61 %62 
                                                      OpStore %50 %63 
                               Uniform f32_4* %64 = OpAccessChain %22 %53 %37 
                                        f32_4 %65 = OpLoad %64 
                                        f32_4 %66 = OpLoad %9 
                                        f32_4 %67 = OpVectorShuffle %66 %66 2 2 2 2 
                                        f32_4 %68 = OpFMul %65 %67 
                                        f32_4 %69 = OpLoad %50 
                                        f32_4 %70 = OpFAdd %68 %69 
                                                      OpStore %50 %70 
                               Uniform f32_4* %71 = OpAccessChain %22 %53 %46 
                                        f32_4 %72 = OpLoad %71 
                                        f32_4 %73 = OpLoad %9 
                                        f32_4 %74 = OpVectorShuffle %73 %73 3 3 3 3 
                                        f32_4 %75 = OpFMul %72 %74 
                                        f32_4 %76 = OpLoad %50 
                                        f32_4 %77 = OpFAdd %75 %76 
                                                      OpStore %9 %77 
                                 Uniform f32* %85 = OpAccessChain %22 %83 
                                          f32 %86 = OpLoad %85 
                                          f32 %87 = OpFNegate %86 
                                 Private f32* %90 = OpAccessChain %9 %88 
                                          f32 %91 = OpLoad %90 
                                          f32 %92 = OpFMul %87 %91 
                                 Private f32* %94 = OpAccessChain %9 %93 
                                          f32 %95 = OpLoad %94 
                                          f32 %96 = OpFAdd %92 %95 
                                  Output f32* %98 = OpAccessChain %82 %29 %93 
                                                      OpStore %98 %96 
                                        f32_4 %99 = OpLoad %9 
                                       f32_3 %100 = OpVectorShuffle %99 %99 0 1 3 
                               Output f32_4* %102 = OpAccessChain %82 %29 
                                       f32_4 %103 = OpLoad %102 
                                       f32_4 %104 = OpVectorShuffle %103 %100 4 5 2 6 
                                                      OpStore %102 %104 
                                       f32_4 %107 = OpLoad %106 
                                                      OpStore %105 %107 
                                       f32_4 %110 = OpLoad %109 
                                                      OpStore %108 %110 
                                       f32_4 %113 = OpLoad %112 
                                                      OpStore %111 %113 
                                       f32_4 %116 = OpLoad %115 
                                                      OpStore %114 %116 
                                       f32_4 %117 = OpLoad %11 
                                       f32_3 %118 = OpVectorShuffle %117 %117 1 1 1 
                              Uniform f32_4* %119 = OpAccessChain %22 %24 %24 
                                       f32_4 %120 = OpLoad %119 
                                       f32_3 %121 = OpVectorShuffle %120 %120 0 1 2 
                                       f32_3 %122 = OpFMul %118 %121 
                                       f32_4 %123 = OpLoad %9 
                                       f32_4 %124 = OpVectorShuffle %123 %122 4 5 6 3 
                                                      OpStore %9 %124 
                              Uniform f32_4* %125 = OpAccessChain %22 %24 %29 
                                       f32_4 %126 = OpLoad %125 
                                       f32_3 %127 = OpVectorShuffle %126 %126 0 1 2 
                                       f32_4 %128 = OpLoad %11 
                                       f32_3 %129 = OpVectorShuffle %128 %128 0 0 0 
                                       f32_3 %130 = OpFMul %127 %129 
                                       f32_4 %131 = OpLoad %9 
                                       f32_3 %132 = OpVectorShuffle %131 %131 0 1 2 
                                       f32_3 %133 = OpFAdd %130 %132 
                                       f32_4 %134 = OpLoad %9 
                                       f32_4 %135 = OpVectorShuffle %134 %133 4 5 6 3 
                                                      OpStore %9 %135 
                              Uniform f32_4* %136 = OpAccessChain %22 %24 %37 
                                       f32_4 %137 = OpLoad %136 
                                       f32_3 %138 = OpVectorShuffle %137 %137 0 1 2 
                                       f32_4 %139 = OpLoad %11 
                                       f32_3 %140 = OpVectorShuffle %139 %139 2 2 2 
                                       f32_3 %141 = OpFMul %138 %140 
                                       f32_4 %142 = OpLoad %9 
                                       f32_3 %143 = OpVectorShuffle %142 %142 0 1 2 
                                       f32_3 %144 = OpFAdd %141 %143 
                                       f32_4 %145 = OpLoad %9 
                                       f32_4 %146 = OpVectorShuffle %145 %144 4 5 6 3 
                                                      OpStore %9 %146 
                              Uniform f32_4* %147 = OpAccessChain %22 %24 %46 
                                       f32_4 %148 = OpLoad %147 
                                       f32_3 %149 = OpVectorShuffle %148 %148 0 1 2 
                                       f32_4 %150 = OpLoad %11 
                                       f32_3 %151 = OpVectorShuffle %150 %150 3 3 3 
                                       f32_3 %152 = OpFMul %149 %151 
                                       f32_4 %153 = OpLoad %9 
                                       f32_3 %154 = OpVectorShuffle %153 %153 0 1 2 
                                       f32_3 %155 = OpFAdd %152 %154 
                                       f32_4 %156 = OpLoad %9 
                                       f32_4 %157 = OpVectorShuffle %156 %155 4 5 6 3 
                                                      OpStore %9 %157 
                                       f32_4 %158 = OpLoad %9 
                                       f32_3 %159 = OpVectorShuffle %158 %158 0 1 2 
                                       f32_3 %160 = OpFNegate %159 
                              Uniform f32_3* %162 = OpAccessChain %22 %29 
                                       f32_3 %163 = OpLoad %162 
                                       f32_3 %164 = OpFAdd %160 %163 
                                       f32_4 %165 = OpLoad %9 
                                       f32_4 %166 = OpVectorShuffle %165 %164 4 5 6 3 
                                                      OpStore %9 %166 
                                       f32_4 %168 = OpLoad %9 
                                       f32_3 %169 = OpVectorShuffle %168 %168 0 1 2 
                                       f32_4 %170 = OpLoad %9 
                                       f32_3 %171 = OpVectorShuffle %170 %170 0 1 2 
                                         f32 %172 = OpDot %169 %171 
                                                      OpStore %167 %172 
                                         f32 %173 = OpLoad %167 
                                         f32 %174 = OpExtInst %1 32 %173 
                                                      OpStore %167 %174 
                                         f32 %175 = OpLoad %167 
                                       f32_3 %176 = OpCompositeConstruct %175 %175 %175 
                                       f32_4 %177 = OpLoad %9 
                                       f32_3 %178 = OpVectorShuffle %177 %177 0 1 2 
                                       f32_3 %179 = OpFMul %176 %178 
                                       f32_4 %180 = OpLoad %9 
                                       f32_4 %181 = OpVectorShuffle %180 %179 4 5 6 3 
                                                      OpStore %9 %181 
                                       f32_4 %183 = OpLoad %182 
                                       f32_3 %184 = OpVectorShuffle %183 %183 1 1 1 
                              Uniform f32_4* %185 = OpAccessChain %22 %24 %24 
                                       f32_4 %186 = OpLoad %185 
                                       f32_3 %187 = OpVectorShuffle %186 %186 1 2 0 
                                       f32_3 %188 = OpFMul %184 %187 
                                       f32_4 %189 = OpLoad %50 
                                       f32_4 %190 = OpVectorShuffle %189 %188 4 5 6 3 
                                                      OpStore %50 %190 
                              Uniform f32_4* %191 = OpAccessChain %22 %24 %29 
                                       f32_4 %192 = OpLoad %191 
                                       f32_3 %193 = OpVectorShuffle %192 %192 1 2 0 
                                       f32_4 %194 = OpLoad %182 
                                       f32_3 %195 = OpVectorShuffle %194 %194 0 0 0 
                                       f32_3 %196 = OpFMul %193 %195 
                                       f32_4 %197 = OpLoad %50 
                                       f32_3 %198 = OpVectorShuffle %197 %197 0 1 2 
                                       f32_3 %199 = OpFAdd %196 %198 
                                       f32_4 %200 = OpLoad %50 
                                       f32_4 %201 = OpVectorShuffle %200 %199 4 5 6 3 
                                                      OpStore %50 %201 
                              Uniform f32_4* %202 = OpAccessChain %22 %24 %37 
                                       f32_4 %203 = OpLoad %202 
                                       f32_3 %204 = OpVectorShuffle %203 %203 1 2 0 
                                       f32_4 %205 = OpLoad %182 
                                       f32_3 %206 = OpVectorShuffle %205 %205 2 2 2 
                                       f32_3 %207 = OpFMul %204 %206 
                                       f32_4 %208 = OpLoad %50 
                                       f32_3 %209 = OpVectorShuffle %208 %208 0 1 2 
                                       f32_3 %210 = OpFAdd %207 %209 
                                       f32_4 %211 = OpLoad %50 
                                       f32_4 %212 = OpVectorShuffle %211 %210 4 5 6 3 
                                                      OpStore %50 %212 
                                       f32_4 %213 = OpLoad %50 
                                       f32_3 %214 = OpVectorShuffle %213 %213 0 1 2 
                                       f32_4 %215 = OpLoad %50 
                                       f32_3 %216 = OpVectorShuffle %215 %215 0 1 2 
                                         f32 %217 = OpDot %214 %216 
                                                      OpStore %167 %217 
                                         f32 %218 = OpLoad %167 
                                         f32 %219 = OpExtInst %1 32 %218 
                                                      OpStore %167 %219 
                                         f32 %220 = OpLoad %167 
                                       f32_3 %221 = OpCompositeConstruct %220 %220 %220 
                                       f32_4 %222 = OpLoad %50 
                                       f32_3 %223 = OpVectorShuffle %222 %222 1 0 2 
                                       f32_3 %224 = OpFMul %221 %223 
                                       f32_4 %225 = OpLoad %50 
                                       f32_4 %226 = OpVectorShuffle %225 %224 4 5 6 3 
                                                      OpStore %50 %226 
                                       f32_3 %231 = OpLoad %230 
                              Uniform f32_4* %232 = OpAccessChain %22 %37 %29 
                                       f32_4 %233 = OpLoad %232 
                                       f32_3 %234 = OpVectorShuffle %233 %233 0 1 2 
                                         f32 %235 = OpDot %231 %234 
                                Private f32* %236 = OpAccessChain %228 %78 
                                                      OpStore %236 %235 
                                       f32_3 %237 = OpLoad %230 
                              Uniform f32_4* %238 = OpAccessChain %22 %37 %24 
                                       f32_4 %239 = OpLoad %238 
                                       f32_3 %240 = OpVectorShuffle %239 %239 0 1 2 
                                         f32 %241 = OpDot %237 %240 
                                Private f32* %242 = OpAccessChain %228 %93 
                                                      OpStore %242 %241 
                                       f32_3 %243 = OpLoad %230 
                              Uniform f32_4* %244 = OpAccessChain %22 %37 %37 
                                       f32_4 %245 = OpLoad %244 
                                       f32_3 %246 = OpVectorShuffle %245 %245 0 1 2 
                                         f32 %247 = OpDot %243 %246 
                                Private f32* %249 = OpAccessChain %228 %248 
                                                      OpStore %249 %247 
                                       f32_3 %250 = OpLoad %228 
                                       f32_3 %251 = OpLoad %228 
                                         f32 %252 = OpDot %250 %251 
                                                      OpStore %167 %252 
                                         f32 %253 = OpLoad %167 
                                         f32 %254 = OpExtInst %1 32 %253 
                                                      OpStore %167 %254 
                                         f32 %255 = OpLoad %167 
                                       f32_3 %256 = OpCompositeConstruct %255 %255 %255 
                                       f32_3 %257 = OpLoad %228 
                                       f32_3 %258 = OpFMul %256 %257 
                                                      OpStore %228 %258 
                                       f32_4 %260 = OpLoad %50 
                                       f32_3 %261 = OpVectorShuffle %260 %260 1 0 2 
                                       f32_3 %262 = OpLoad %228 
                                       f32_3 %263 = OpFMul %261 %262 
                                                      OpStore %259 %263 
                                       f32_3 %264 = OpLoad %228 
                                       f32_3 %265 = OpVectorShuffle %264 %264 2 0 1 
                                       f32_4 %266 = OpLoad %50 
                                       f32_3 %267 = OpVectorShuffle %266 %266 0 2 1 
                                       f32_3 %268 = OpFMul %265 %267 
                                       f32_3 %269 = OpLoad %259 
                                       f32_3 %270 = OpFNegate %269 
                                       f32_3 %271 = OpFAdd %268 %270 
                                                      OpStore %259 %271 
                                  Input f32* %273 = OpAccessChain %182 %88 
                                         f32 %274 = OpLoad %273 
                                Uniform f32* %275 = OpAccessChain %22 %46 %88 
                                         f32 %276 = OpLoad %275 
                                         f32 %277 = OpFMul %274 %276 
                                                      OpStore %167 %277 
                                         f32 %278 = OpLoad %167 
                                       f32_3 %279 = OpCompositeConstruct %278 %278 %278 
                                       f32_3 %280 = OpLoad %259 
                                       f32_3 %281 = OpVectorShuffle %280 %280 1 0 2 
                                       f32_3 %282 = OpFMul %279 %281 
                                                      OpStore %259 %282 
                                Private f32* %284 = OpAccessChain %259 %248 
                                         f32 %285 = OpLoad %284 
                                Private f32* %286 = OpAccessChain %283 %78 
                                                      OpStore %286 %285 
                                Private f32* %287 = OpAccessChain %50 %78 
                                         f32 %288 = OpLoad %287 
                                Private f32* %289 = OpAccessChain %283 %248 
                                                      OpStore %289 %288 
                                Private f32* %290 = OpAccessChain %228 %93 
                                         f32 %291 = OpLoad %290 
                                Private f32* %292 = OpAccessChain %283 %93 
                                                      OpStore %292 %291 
                                       f32_4 %293 = OpLoad %9 
                                       f32_3 %294 = OpVectorShuffle %293 %293 1 1 1 
                                       f32_3 %295 = OpLoad %283 
                                       f32_3 %296 = OpFMul %294 %295 
                                                      OpStore %283 %296 
                                Private f32* %297 = OpAccessChain %259 %93 
                                         f32 %298 = OpLoad %297 
                                Private f32* %299 = OpAccessChain %50 %78 
                                                      OpStore %299 %298 
                                Private f32* %300 = OpAccessChain %50 %93 
                                         f32 %301 = OpLoad %300 
                                Private f32* %302 = OpAccessChain %259 %248 
                                                      OpStore %302 %301 
                                Private f32* %303 = OpAccessChain %228 %78 
                                         f32 %304 = OpLoad %303 
                                Private f32* %305 = OpAccessChain %259 %93 
                                                      OpStore %305 %304 
                                Private f32* %306 = OpAccessChain %228 %248 
                                         f32 %307 = OpLoad %306 
                                Private f32* %308 = OpAccessChain %50 %93 
                                                      OpStore %308 %307 
                                       f32_3 %309 = OpLoad %259 
                                       f32_4 %310 = OpLoad %9 
                                       f32_3 %311 = OpVectorShuffle %310 %310 0 0 0 
                                       f32_3 %312 = OpFMul %309 %311 
                                       f32_3 %313 = OpLoad %283 
                                       f32_3 %314 = OpFAdd %312 %313 
                                       f32_4 %315 = OpLoad %9 
                                       f32_4 %316 = OpVectorShuffle %315 %314 4 5 2 6 
                                                      OpStore %9 %316 
                                       f32_4 %318 = OpLoad %50 
                                       f32_3 %319 = OpVectorShuffle %318 %318 0 1 2 
                                       f32_4 %320 = OpLoad %9 
                                       f32_3 %321 = OpVectorShuffle %320 %320 2 2 2 
                                       f32_3 %322 = OpFMul %319 %321 
                                       f32_4 %323 = OpLoad %9 
                                       f32_3 %324 = OpVectorShuffle %323 %323 0 1 3 
                                       f32_3 %325 = OpFAdd %322 %324 
                                       f32_4 %326 = OpLoad %317 
                                       f32_4 %327 = OpVectorShuffle %326 %325 4 5 6 3 
                                                      OpStore %317 %327 
                                 Output f32* %329 = OpAccessChain %317 %88 
                                                      OpStore %329 %328 
                                 Output f32* %330 = OpAccessChain %82 %29 %78 
                                         f32 %331 = OpLoad %330 
                                         f32 %332 = OpFNegate %331 
                                 Output f32* %333 = OpAccessChain %82 %29 %78 
                                                      OpStore %333 %332 
                                                      OpReturn
                                                      OpFunctionEnd
; SPIR-V
; Version: 1.0
; Generator: Khronos Glslang Reference Front End; 1
; Bound: 571
; Schema: 0
                                                      OpCapability Shader 
                                               %1 = OpExtInstImport "GLSL.std.450" 
                                                      OpMemoryModel Logical GLSL450 
                                                      OpEntryPoint Fragment %4 "main" %11 %44 %568 
                                                      OpExecutionMode %4 OriginUpperLeft 
                                                      OpDecorate %11 Location 11 
                                                      OpMemberDecorate %15 0 Offset 15 
                                                      OpMemberDecorate %15 1 Offset 15 
                                                      OpMemberDecorate %15 2 Offset 15 
                                                      OpMemberDecorate %15 3 RelaxedPrecision 
                                                      OpMemberDecorate %15 3 Offset 15 
                                                      OpMemberDecorate %15 4 RelaxedPrecision 
                                                      OpMemberDecorate %15 4 Offset 15 
                                                      OpMemberDecorate %15 5 Offset 15 
                                                      OpMemberDecorate %15 6 Offset 15 
                                                      OpMemberDecorate %15 7 Offset 15 
                                                      OpMemberDecorate %15 8 Offset 15 
                                                      OpMemberDecorate %15 9 Offset 15 
                                                      OpMemberDecorate %15 10 Offset 15 
                                                      OpMemberDecorate %15 11 Offset 15 
                                                      OpMemberDecorate %15 12 Offset 15 
                                                      OpMemberDecorate %15 13 Offset 15 
                                                      OpMemberDecorate %15 14 Offset 15 
                                                      OpMemberDecorate %15 15 Offset 15 
                                                      OpMemberDecorate %15 16 Offset 15 
                                                      OpMemberDecorate %15 17 Offset 15 
                                                      OpMemberDecorate %15 18 Offset 15 
                                                      OpMemberDecorate %15 19 Offset 15 
                                                      OpMemberDecorate %15 20 Offset 15 
                                                      OpMemberDecorate %15 21 Offset 15 
                                                      OpMemberDecorate %15 22 Offset 15 
                                                      OpMemberDecorate %15 23 Offset 15 
                                                      OpMemberDecorate %15 24 Offset 15 
                                                      OpMemberDecorate %15 25 Offset 15 
                                                      OpMemberDecorate %15 26 Offset 15 
                                                      OpMemberDecorate %15 27 Offset 15 
                                                      OpMemberDecorate %15 28 Offset 15 
                                                      OpMemberDecorate %15 29 RelaxedPrecision 
                                                      OpMemberDecorate %15 29 Offset 15 
                                                      OpMemberDecorate %15 30 RelaxedPrecision 
                                                      OpMemberDecorate %15 30 Offset 15 
                                                      OpDecorate %15 Block 
                                                      OpDecorate %17 DescriptorSet 17 
                                                      OpDecorate %17 Binding 17 
                                                      OpDecorate %44 Location 44 
                                                      OpDecorate %76 RelaxedPrecision 
                                                      OpDecorate %80 RelaxedPrecision 
                                                      OpDecorate %80 DescriptorSet 80 
                                                      OpDecorate %80 Binding 80 
                                                      OpDecorate %81 RelaxedPrecision 
                                                      OpDecorate %85 RelaxedPrecision 
                                                      OpDecorate %86 RelaxedPrecision 
                                                      OpDecorate %106 RelaxedPrecision 
                                                      OpDecorate %109 RelaxedPrecision 
                                                      OpDecorate %110 RelaxedPrecision 
                                                      OpDecorate %114 RelaxedPrecision 
                                                      OpDecorate %120 RelaxedPrecision 
                                                      OpDecorate %122 RelaxedPrecision 
                                                      OpDecorate %147 RelaxedPrecision 
                                                      OpDecorate %148 RelaxedPrecision 
                                                      OpDecorate %148 DescriptorSet 148 
                                                      OpDecorate %148 Binding 148 
                                                      OpDecorate %149 RelaxedPrecision 
                                                      OpDecorate %153 RelaxedPrecision 
                                                      OpDecorate %167 RelaxedPrecision 
                                                      OpDecorate %169 RelaxedPrecision 
                                                      OpDecorate %177 RelaxedPrecision 
                                                      OpDecorate %191 RelaxedPrecision 
                                                      OpDecorate %192 RelaxedPrecision 
                                                      OpDecorate %192 DescriptorSet 192 
                                                      OpDecorate %192 Binding 192 
                                                      OpDecorate %193 RelaxedPrecision 
                                                      OpDecorate %196 RelaxedPrecision 
                                                      OpDecorate %197 RelaxedPrecision 
                                                      OpDecorate %218 RelaxedPrecision 
                                                      OpDecorate %220 RelaxedPrecision 
                                                      OpDecorate %231 RelaxedPrecision 
                                                      OpDecorate %247 RelaxedPrecision 
                                                      OpDecorate %247 DescriptorSet 247 
                                                      OpDecorate %247 Binding 247 
                                                      OpDecorate %248 RelaxedPrecision 
                                                      OpDecorate %252 RelaxedPrecision 
                                                      OpDecorate %268 RelaxedPrecision 
                                                      OpDecorate %270 RelaxedPrecision 
                                                      OpDecorate %281 RelaxedPrecision 
                                                      OpDecorate %282 RelaxedPrecision 
                                                      OpDecorate %282 DescriptorSet 282 
                                                      OpDecorate %282 Binding 282 
                                                      OpDecorate %283 RelaxedPrecision 
                                                      OpDecorate %287 RelaxedPrecision 
                                                      OpDecorate %288 RelaxedPrecision 
                                                      OpDecorate %304 RelaxedPrecision 
                                                      OpDecorate %311 RelaxedPrecision 
                                                      OpDecorate %347 RelaxedPrecision 
                                                      OpDecorate %349 RelaxedPrecision 
                                                      OpDecorate %368 RelaxedPrecision 
                                                      OpDecorate %368 DescriptorSet 368 
                                                      OpDecorate %368 Binding 368 
                                                      OpDecorate %369 RelaxedPrecision 
                                                      OpDecorate %372 RelaxedPrecision 
                                                      OpDecorate %373 RelaxedPrecision 
                                                      OpDecorate %463 RelaxedPrecision 
                                                      OpDecorate %464 RelaxedPrecision 
                                                      OpDecorate %464 DescriptorSet 464 
                                                      OpDecorate %464 Binding 464 
                                                      OpDecorate %465 RelaxedPrecision 
                                                      OpDecorate %469 RelaxedPrecision 
                                                      OpDecorate %470 RelaxedPrecision 
                                                      OpDecorate %500 RelaxedPrecision 
                                                      OpDecorate %501 RelaxedPrecision 
                                                      OpDecorate %501 DescriptorSet 501 
                                                      OpDecorate %501 Binding 501 
                                                      OpDecorate %502 RelaxedPrecision 
                                                      OpDecorate %506 RelaxedPrecision 
                                                      OpDecorate %507 RelaxedPrecision 
                                                      OpDecorate %549 RelaxedPrecision 
                                                      OpDecorate %553 RelaxedPrecision 
                                                      OpDecorate %568 RelaxedPrecision 
                                                      OpDecorate %568 Location 568 
                                               %2 = OpTypeVoid 
                                               %3 = OpTypeFunction %2 
                                               %6 = OpTypeFloat 32 
                                               %7 = OpTypeVector %6 4 
                                               %8 = OpTypePointer Private %7 
                                Private f32_4* %9 = OpVariable Private 
                                              %10 = OpTypePointer Input %7 
                                 Input f32_4* %11 = OpVariable Input 
                                              %12 = OpTypeVector %6 2 
                                              %15 = OpTypeStruct %7 %7 %7 %6 %6 %6 %6 %6 %7 %7 %6 %6 %7 %6 %6 %7 %6 %7 %6 %7 %6 %6 %7 %6 %7 %6 %7 %6 %6 %6 %6 
                                              %16 = OpTypePointer Uniform %15 
Uniform struct {f32_4; f32_4; f32_4; f32; f32; f32; f32; f32; f32_4; f32_4; f32; f32; f32_4; f32; f32; f32_4; f32; f32_4; f32; f32_4; f32; f32; f32_4; f32; f32_4; f32; f32_4; f32; f32; f32; f32;}* %17 = OpVariable Uniform 
                                              %18 = OpTypeInt 32 1 
                                          i32 %19 = OpConstant 17 
                                              %20 = OpTypePointer Uniform %7 
                                              %31 = OpTypePointer Private %12 
                               Private f32_2* %32 = OpVariable Private 
                                          i32 %33 = OpConstant 18 
                                              %34 = OpTypePointer Uniform %6 
                                          f32 %37 = OpConstant 3.674022E-40 
                                              %39 = OpTypeInt 32 0 
                                          u32 %40 = OpConstant 0 
                                              %41 = OpTypePointer Private %6 
                                 Private f32* %43 = OpVariable Private 
                                 Input f32_4* %44 = OpVariable Input 
                                              %45 = OpTypeVector %6 3 
                                              %53 = OpTypePointer Private %45 
                               Private f32_3* %54 = OpVariable Private 
                                          f32 %68 = OpConstant 3.674022E-40 
                                        f32_2 %69 = OpConstantComposite %68 %68 
                                 Private f32* %76 = OpVariable Private 
                                              %77 = OpTypeImage %6 Dim2D 0 0 0 1 Unknown 
                                              %78 = OpTypeSampledImage %77 
                                              %79 = OpTypePointer UniformConstant %78 
  UniformConstant read_only Texture2DSampled* %80 = OpVariable UniformConstant 
                                          i32 %87 = OpConstant 16 
                               Private f32_3* %92 = OpVariable Private 
                                          i32 %95 = OpConstant 9 
                                Private f32* %106 = OpVariable Private 
                                         i32 %107 = OpConstant 3 
                              Private f32_2* %111 = OpVariable Private 
                                         i32 %118 = OpConstant 4 
                                         i32 %133 = OpConstant 0 
                                         i32 %137 = OpConstant 10 
                                Private f32* %147 = OpVariable Private 
 UniformConstant read_only Texture2DSampled* %148 = OpVariable UniformConstant 
                                         i32 %156 = OpConstant 8 
                                         i32 %179 = OpConstant 11 
                                Private f32* %191 = OpVariable Private 
 UniformConstant read_only Texture2DSampled* %192 = OpVariable UniformConstant 
                              Private f32_3* %202 = OpVariable Private 
                                         i32 %205 = OpConstant 15 
 UniformConstant read_only Texture2DSampled* %247 = OpVariable UniformConstant 
                                         i32 %255 = OpConstant 12 
                                Private f32* %281 = OpVariable Private 
 UniformConstant read_only Texture2DSampled* %282 = OpVariable UniformConstant 
                                         i32 %289 = OpConstant 13 
                                         i32 %294 = OpConstant 14 
                                         f32 %299 = OpConstant 3.674022E-40 
                                         f32 %300 = OpConstant 3.674022E-40 
                                         i32 %327 = OpConstant 21 
                                         i32 %334 = OpConstant 2 
                                         i32 %361 = OpConstant 5 
 UniformConstant read_only Texture2DSampled* %368 = OpVariable UniformConstant 
                                         i32 %374 = OpConstant 6 
                                         i32 %380 = OpConstant 1 
                                         i32 %386 = OpConstant 7 
                              Private f32_3* %406 = OpVariable Private 
                                         i32 %407 = OpConstant 19 
                                         i32 %411 = OpConstant 20 
                                         i32 %424 = OpConstant 22 
                                         i32 %433 = OpConstant 25 
                                         i32 %447 = OpConstant 24 
                                Private f32* %463 = OpVariable Private 
 UniformConstant read_only Texture2DSampled* %464 = OpVariable UniformConstant 
                                         i32 %471 = OpConstant 23 
                                         i32 %478 = OpConstant 26 
                                         u32 %489 = OpConstant 1 
                                         i32 %492 = OpConstant 27 
                              Private f32_3* %500 = OpVariable Private 
 UniformConstant read_only Texture2DSampled* %501 = OpVariable UniformConstant 
                                         i32 %529 = OpConstant 28 
                                             %544 = OpTypePointer Input %6 
                                         i32 %547 = OpConstant 29 
                                         i32 %551 = OpConstant 30 
                                         u32 %561 = OpConstant 3 
                                             %567 = OpTypePointer Output %7 
                               Output f32_4* %568 = OpVariable Output 
                                          void %4 = OpFunction None %3 
                                               %5 = OpLabel 
                                        f32_4 %13 = OpLoad %11 
                                        f32_2 %14 = OpVectorShuffle %13 %13 0 1 
                               Uniform f32_4* %21 = OpAccessChain %17 %19 
                                        f32_4 %22 = OpLoad %21 
                                        f32_2 %23 = OpVectorShuffle %22 %22 0 1 
                                        f32_2 %24 = OpFMul %14 %23 
                               Uniform f32_4* %25 = OpAccessChain %17 %19 
                                        f32_4 %26 = OpLoad %25 
                                        f32_2 %27 = OpVectorShuffle %26 %26 2 3 
                                        f32_2 %28 = OpFAdd %24 %27 
                                        f32_4 %29 = OpLoad %9 
                                        f32_4 %30 = OpVectorShuffle %29 %28 4 5 2 3 
                                                      OpStore %9 %30 
                                 Uniform f32* %35 = OpAccessChain %17 %33 
                                          f32 %36 = OpLoad %35 
                                          f32 %38 = OpFAdd %36 %37 
                                 Private f32* %42 = OpAccessChain %32 %40 
                                                      OpStore %42 %38 
                                        f32_4 %46 = OpLoad %44 
                                        f32_3 %47 = OpVectorShuffle %46 %46 0 1 2 
                                        f32_4 %48 = OpLoad %44 
                                        f32_3 %49 = OpVectorShuffle %48 %48 0 1 2 
                                          f32 %50 = OpDot %47 %49 
                                                      OpStore %43 %50 
                                          f32 %51 = OpLoad %43 
                                          f32 %52 = OpExtInst %1 32 %51 
                                                      OpStore %43 %52 
                                          f32 %55 = OpLoad %43 
                                        f32_2 %56 = OpCompositeConstruct %55 %55 
                                        f32_4 %57 = OpLoad %44 
                                        f32_2 %58 = OpVectorShuffle %57 %57 0 1 
                                        f32_2 %59 = OpFMul %56 %58 
                                        f32_3 %60 = OpLoad %54 
                                        f32_3 %61 = OpVectorShuffle %60 %59 3 4 2 
                                                      OpStore %54 %61 
                                        f32_2 %62 = OpLoad %32 
                                        f32_2 %63 = OpVectorShuffle %62 %62 0 0 
                                        f32_3 %64 = OpLoad %54 
                                        f32_2 %65 = OpVectorShuffle %64 %64 0 1 
                                        f32_2 %66 = OpFMul %63 %65 
                                                      OpStore %32 %66 
                                        f32_2 %67 = OpLoad %32 
                                        f32_2 %70 = OpFMul %67 %69 
                                        f32_4 %71 = OpLoad %9 
                                        f32_2 %72 = OpVectorShuffle %71 %71 0 1 
                                        f32_2 %73 = OpFAdd %70 %72 
                                        f32_4 %74 = OpLoad %9 
                                        f32_4 %75 = OpVectorShuffle %74 %73 4 5 2 3 
                                                      OpStore %9 %75 
                   read_only Texture2DSampled %81 = OpLoad %80 
                                        f32_4 %82 = OpLoad %9 
                                        f32_2 %83 = OpVectorShuffle %82 %82 0 1 
                                        f32_4 %84 = OpImageSampleImplicitLod %81 %83 
                                          f32 %85 = OpCompositeExtract %84 0 
                                                      OpStore %76 %85 
                                          f32 %86 = OpLoad %76 
                                 Uniform f32* %88 = OpAccessChain %17 %87 
                                          f32 %89 = OpLoad %88 
                                          f32 %90 = OpFMul %86 %89 
                                 Private f32* %91 = OpAccessChain %9 %40 
                                                      OpStore %91 %90 
                                        f32_4 %93 = OpLoad %11 
                                        f32_2 %94 = OpVectorShuffle %93 %93 0 1 
                               Uniform f32_4* %96 = OpAccessChain %17 %95 
                                        f32_4 %97 = OpLoad %96 
                                        f32_2 %98 = OpVectorShuffle %97 %97 0 1 
                                        f32_2 %99 = OpFMul %94 %98 
                              Uniform f32_4* %100 = OpAccessChain %17 %95 
                                       f32_4 %101 = OpLoad %100 
                                       f32_2 %102 = OpVectorShuffle %101 %101 2 3 
                                       f32_2 %103 = OpFAdd %99 %102 
                                       f32_3 %104 = OpLoad %92 
                                       f32_3 %105 = OpVectorShuffle %104 %103 3 4 2 
                                                      OpStore %92 %105 
                                Uniform f32* %108 = OpAccessChain %17 %107 
                                         f32 %109 = OpLoad %108 
                                         f32 %110 = OpFAdd %109 %37 
                                                      OpStore %106 %110 
                                       f32_3 %112 = OpLoad %54 
                                       f32_2 %113 = OpVectorShuffle %112 %112 0 1 
                                         f32 %114 = OpLoad %106 
                                       f32_2 %115 = OpCompositeConstruct %114 %114 
                                       f32_2 %116 = OpFMul %113 %115 
                                                      OpStore %111 %116 
                                       f32_2 %117 = OpLoad %111 
                                Uniform f32* %119 = OpAccessChain %17 %118 
                                         f32 %120 = OpLoad %119 
                                Uniform f32* %121 = OpAccessChain %17 %118 
                                         f32 %122 = OpLoad %121 
                                       f32_2 %123 = OpCompositeConstruct %120 %122 
                                         f32 %124 = OpCompositeExtract %123 0 
                                         f32 %125 = OpCompositeExtract %123 1 
                                       f32_2 %126 = OpCompositeConstruct %124 %125 
                                       f32_2 %127 = OpFMul %117 %126 
                                       f32_3 %128 = OpLoad %92 
                                       f32_2 %129 = OpVectorShuffle %128 %128 0 1 
                                       f32_2 %130 = OpFAdd %127 %129 
                                       f32_3 %131 = OpLoad %92 
                                       f32_3 %132 = OpVectorShuffle %131 %130 3 4 2 
                                                      OpStore %92 %132 
                              Uniform f32_4* %134 = OpAccessChain %17 %133 
                                       f32_4 %135 = OpLoad %134 
                                       f32_2 %136 = OpVectorShuffle %135 %135 1 1 
                                Uniform f32* %138 = OpAccessChain %17 %137 
                                         f32 %139 = OpLoad %138 
                                       f32_2 %140 = OpCompositeConstruct %139 %139 
                                       f32_2 %141 = OpFMul %136 %140 
                                       f32_3 %142 = OpLoad %92 
                                       f32_2 %143 = OpVectorShuffle %142 %142 0 1 
                                       f32_2 %144 = OpFAdd %141 %143 
                                       f32_3 %145 = OpLoad %92 
                                       f32_3 %146 = OpVectorShuffle %145 %144 3 4 2 
                                                      OpStore %92 %146 
                  read_only Texture2DSampled %149 = OpLoad %148 
                                       f32_3 %150 = OpLoad %92 
                                       f32_2 %151 = OpVectorShuffle %150 %150 0 1 
                                       f32_4 %152 = OpImageSampleImplicitLod %149 %151 
                                         f32 %153 = OpCompositeExtract %152 0 
                                                      OpStore %147 %153 
                                       f32_4 %154 = OpLoad %11 
                                       f32_2 %155 = OpVectorShuffle %154 %154 0 1 
                              Uniform f32_4* %157 = OpAccessChain %17 %156 
                                       f32_4 %158 = OpLoad %157 
                                       f32_2 %159 = OpVectorShuffle %158 %158 0 1 
                                       f32_2 %160 = OpFMul %155 %159 
                              Uniform f32_4* %161 = OpAccessChain %17 %156 
                                       f32_4 %162 = OpLoad %161 
                                       f32_2 %163 = OpVectorShuffle %162 %162 2 3 
                                       f32_2 %164 = OpFAdd %160 %163 
                                                      OpStore %32 %164 
                                       f32_2 %165 = OpLoad %111 
                                Uniform f32* %166 = OpAccessChain %17 %118 
                                         f32 %167 = OpLoad %166 
                                Uniform f32* %168 = OpAccessChain %17 %118 
                                         f32 %169 = OpLoad %168 
                                       f32_2 %170 = OpCompositeConstruct %167 %169 
                                         f32 %171 = OpCompositeExtract %170 0 
                                         f32 %172 = OpCompositeExtract %170 1 
                                       f32_2 %173 = OpCompositeConstruct %171 %172 
                                       f32_2 %174 = OpFMul %165 %173 
                                       f32_2 %175 = OpLoad %32 
                                       f32_2 %176 = OpFAdd %174 %175 
                                                      OpStore %32 %176 
                                         f32 %177 = OpLoad %147 
                                       f32_2 %178 = OpCompositeConstruct %177 %177 
                                Uniform f32* %180 = OpAccessChain %17 %179 
                                         f32 %181 = OpLoad %180 
                                Uniform f32* %182 = OpAccessChain %17 %179 
                                         f32 %183 = OpLoad %182 
                                       f32_2 %184 = OpCompositeConstruct %181 %183 
                                         f32 %185 = OpCompositeExtract %184 0 
                                         f32 %186 = OpCompositeExtract %184 1 
                                       f32_2 %187 = OpCompositeConstruct %185 %186 
                                       f32_2 %188 = OpFMul %178 %187 
                                       f32_2 %189 = OpLoad %32 
                                       f32_2 %190 = OpFAdd %188 %189 
                                                      OpStore %32 %190 
                  read_only Texture2DSampled %193 = OpLoad %192 
                                       f32_2 %194 = OpLoad %32 
                                       f32_4 %195 = OpImageSampleImplicitLod %193 %194 
                                         f32 %196 = OpCompositeExtract %195 0 
                                                      OpStore %191 %196 
                                         f32 %197 = OpLoad %191 
                                Private f32* %198 = OpAccessChain %9 %40 
                                         f32 %199 = OpLoad %198 
                                         f32 %200 = OpFMul %197 %199 
                                Private f32* %201 = OpAccessChain %9 %40 
                                                      OpStore %201 %200 
                                       f32_4 %203 = OpLoad %11 
                                       f32_2 %204 = OpVectorShuffle %203 %203 0 1 
                              Uniform f32_4* %206 = OpAccessChain %17 %205 
                                       f32_4 %207 = OpLoad %206 
                                       f32_2 %208 = OpVectorShuffle %207 %207 0 1 
                                       f32_2 %209 = OpFMul %204 %208 
                              Uniform f32_4* %210 = OpAccessChain %17 %205 
                                       f32_4 %211 = OpLoad %210 
                                       f32_2 %212 = OpVectorShuffle %211 %211 2 3 
                                       f32_2 %213 = OpFAdd %209 %212 
                                       f32_3 %214 = OpLoad %202 
                                       f32_3 %215 = OpVectorShuffle %214 %213 3 4 2 
                                                      OpStore %202 %215 
                                       f32_2 %216 = OpLoad %111 
                                Uniform f32* %217 = OpAccessChain %17 %118 
                                         f32 %218 = OpLoad %217 
                                Uniform f32* %219 = OpAccessChain %17 %118 
                                         f32 %220 = OpLoad %219 
                                       f32_2 %221 = OpCompositeConstruct %218 %220 
                                         f32 %222 = OpCompositeExtract %221 0 
                                         f32 %223 = OpCompositeExtract %221 1 
                                       f32_2 %224 = OpCompositeConstruct %222 %223 
                                       f32_2 %225 = OpFMul %216 %224 
                                       f32_3 %226 = OpLoad %202 
                                       f32_2 %227 = OpVectorShuffle %226 %226 0 1 
                                       f32_2 %228 = OpFAdd %225 %227 
                                       f32_3 %229 = OpLoad %202 
                                       f32_3 %230 = OpVectorShuffle %229 %228 3 4 2 
                                                      OpStore %202 %230 
                                         f32 %231 = OpLoad %147 
                                       f32_2 %232 = OpCompositeConstruct %231 %231 
                                Uniform f32* %233 = OpAccessChain %17 %179 
                                         f32 %234 = OpLoad %233 
                                Uniform f32* %235 = OpAccessChain %17 %179 
                                         f32 %236 = OpLoad %235 
                                       f32_2 %237 = OpCompositeConstruct %234 %236 
                                         f32 %238 = OpCompositeExtract %237 0 
                                         f32 %239 = OpCompositeExtract %237 1 
                                       f32_2 %240 = OpCompositeConstruct %238 %239 
                                       f32_2 %241 = OpFMul %232 %240 
                                       f32_3 %242 = OpLoad %202 
                                       f32_2 %243 = OpVectorShuffle %242 %242 0 1 
                                       f32_2 %244 = OpFAdd %241 %243 
                                       f32_3 %245 = OpLoad %92 
                                       f32_3 %246 = OpVectorShuffle %245 %244 3 1 4 
                                                      OpStore %92 %246 
                  read_only Texture2DSampled %248 = OpLoad %247 
                                       f32_3 %249 = OpLoad %92 
                                       f32_2 %250 = OpVectorShuffle %249 %249 0 2 
                                       f32_4 %251 = OpImageSampleImplicitLod %248 %250 
                                         f32 %252 = OpCompositeExtract %251 0 
                                                      OpStore %147 %252 
                                       f32_4 %253 = OpLoad %11 
                                       f32_2 %254 = OpVectorShuffle %253 %253 0 1 
                              Uniform f32_4* %256 = OpAccessChain %17 %255 
                                       f32_4 %257 = OpLoad %256 
                                       f32_2 %258 = OpVectorShuffle %257 %257 0 1 
                                       f32_2 %259 = OpFMul %254 %258 
                              Uniform f32_4* %260 = OpAccessChain %17 %255 
                                       f32_4 %261 = OpLoad %260 
                                       f32_2 %262 = OpVectorShuffle %261 %261 2 3 
                                       f32_2 %263 = OpFAdd %259 %262 
                                       f32_3 %264 = OpLoad %202 
                                       f32_3 %265 = OpVectorShuffle %264 %263 3 4 2 
                                                      OpStore %202 %265 
                                       f32_2 %266 = OpLoad %111 
                                Uniform f32* %267 = OpAccessChain %17 %118 
                                         f32 %268 = OpLoad %267 
                                Uniform f32* %269 = OpAccessChain %17 %118 
                                         f32 %270 = OpLoad %269 
                                       f32_2 %271 = OpCompositeConstruct %268 %270 
                                         f32 %272 = OpCompositeExtract %271 0 
                                         f32 %273 = OpCompositeExtract %271 1 
                                       f32_2 %274 = OpCompositeConstruct %272 %273 
                                       f32_2 %275 = OpFMul %266 %274 
                                       f32_3 %276 = OpLoad %202 
                                       f32_2 %277 = OpVectorShuffle %276 %276 0 1 
                                       f32_2 %278 = OpFAdd %275 %277 
                                       f32_3 %279 = OpLoad %202 
                                       f32_3 %280 = OpVectorShuffle %279 %278 3 4 2 
                                                      OpStore %202 %280 
                  read_only Texture2DSampled %283 = OpLoad %282 
                                       f32_3 %284 = OpLoad %202 
                                       f32_2 %285 = OpVectorShuffle %284 %284 0 1 
                                       f32_4 %286 = OpImageSampleImplicitLod %283 %285 
                                         f32 %287 = OpCompositeExtract %286 0 
                                                      OpStore %281 %287 
                                         f32 %288 = OpLoad %281 
                                Uniform f32* %290 = OpAccessChain %17 %289 
                                         f32 %291 = OpLoad %290 
                                         f32 %292 = OpFAdd %288 %291 
                                                      OpStore %43 %292 
                                         f32 %293 = OpLoad %43 
                                Uniform f32* %295 = OpAccessChain %17 %294 
                                         f32 %296 = OpLoad %295 
                                         f32 %297 = OpFMul %293 %296 
                                                      OpStore %43 %297 
                                         f32 %298 = OpLoad %43 
                                         f32 %301 = OpExtInst %1 43 %298 %299 %300 
                                                      OpStore %43 %301 
                                         f32 %302 = OpLoad %43 
                                         f32 %303 = OpFAdd %302 %37 
                                                      OpStore %43 %303 
                                         f32 %304 = OpLoad %147 
                                         f32 %305 = OpLoad %43 
                                         f32 %306 = OpFMul %304 %305 
                                         f32 %307 = OpFAdd %306 %300 
                                Private f32* %308 = OpAccessChain %92 %40 
                                                      OpStore %308 %307 
                                Private f32* %309 = OpAccessChain %92 %40 
                                         f32 %310 = OpLoad %309 
                                         f32 %311 = OpLoad %191 
                                         f32 %312 = OpFMul %310 %311 
                                Private f32* %313 = OpAccessChain %32 %40 
                                                      OpStore %313 %312 
                                Private f32* %314 = OpAccessChain %92 %40 
                                         f32 %315 = OpLoad %314 
                                         f32 %316 = OpFNegate %315 
                                         f32 %317 = OpFAdd %316 %300 
                                Private f32* %318 = OpAccessChain %92 %40 
                                                      OpStore %318 %317 
                                Private f32* %319 = OpAccessChain %92 %40 
                                         f32 %320 = OpLoad %319 
                                Private f32* %321 = OpAccessChain %32 %40 
                                         f32 %322 = OpLoad %321 
                                         f32 %323 = OpFMul %320 %322 
                                Private f32* %324 = OpAccessChain %92 %40 
                                                      OpStore %324 %323 
                                Private f32* %325 = OpAccessChain %92 %40 
                                         f32 %326 = OpLoad %325 
                                Uniform f32* %328 = OpAccessChain %17 %327 
                                         f32 %329 = OpLoad %328 
                                         f32 %330 = OpFMul %326 %329 
                                Private f32* %331 = OpAccessChain %92 %40 
                                                      OpStore %331 %330 
                                       f32_4 %332 = OpLoad %11 
                                       f32_2 %333 = OpVectorShuffle %332 %332 0 1 
                              Uniform f32_4* %335 = OpAccessChain %17 %334 
                                       f32_4 %336 = OpLoad %335 
                                       f32_2 %337 = OpVectorShuffle %336 %336 0 1 
                                       f32_2 %338 = OpFMul %333 %337 
                              Uniform f32_4* %339 = OpAccessChain %17 %334 
                                       f32_4 %340 = OpLoad %339 
                                       f32_2 %341 = OpVectorShuffle %340 %340 2 3 
                                       f32_2 %342 = OpFAdd %338 %341 
                                       f32_3 %343 = OpLoad %202 
                                       f32_3 %344 = OpVectorShuffle %343 %342 3 4 2 
                                                      OpStore %202 %344 
                                       f32_2 %345 = OpLoad %111 
                                Uniform f32* %346 = OpAccessChain %17 %118 
                                         f32 %347 = OpLoad %346 
                                Uniform f32* %348 = OpAccessChain %17 %118 
                                         f32 %349 = OpLoad %348 
                                       f32_2 %350 = OpCompositeConstruct %347 %349 
                                         f32 %351 = OpCompositeExtract %350 0 
                                         f32 %352 = OpCompositeExtract %350 1 
                                       f32_2 %353 = OpCompositeConstruct %351 %352 
                                       f32_2 %354 = OpFMul %345 %353 
                                       f32_3 %355 = OpLoad %202 
                                       f32_2 %356 = OpVectorShuffle %355 %355 0 1 
                                       f32_2 %357 = OpFAdd %354 %356 
                                                      OpStore %111 %357 
                              Uniform f32_4* %358 = OpAccessChain %17 %133 
                                       f32_4 %359 = OpLoad %358 
                                       f32_2 %360 = OpVectorShuffle %359 %359 1 1 
                                Uniform f32* %362 = OpAccessChain %17 %361 
                                         f32 %363 = OpLoad %362 
                                       f32_2 %364 = OpCompositeConstruct %363 %363 
                                       f32_2 %365 = OpFMul %360 %364 
                                       f32_2 %366 = OpLoad %111 
                                       f32_2 %367 = OpFAdd %365 %366 
                                                      OpStore %111 %367 
                  read_only Texture2DSampled %369 = OpLoad %368 
                                       f32_2 %370 = OpLoad %111 
                                       f32_4 %371 = OpImageSampleImplicitLod %369 %370 
                                         f32 %372 = OpCompositeExtract %371 0 
                                                      OpStore %281 %372 
                                         f32 %373 = OpLoad %281 
                                Uniform f32* %375 = OpAccessChain %17 %374 
                                         f32 %376 = OpLoad %375 
                                         f32 %377 = OpFAdd %373 %376 
                                                      OpStore %43 %377 
                                         f32 %378 = OpLoad %43 
                                       f32_3 %379 = OpCompositeConstruct %378 %378 %378 
                              Uniform f32_4* %381 = OpAccessChain %17 %380 
                                       f32_4 %382 = OpLoad %381 
                                       f32_3 %383 = OpVectorShuffle %382 %382 0 1 2 
                                       f32_3 %384 = OpFMul %379 %383 
                                                      OpStore %202 %384 
                                       f32_3 %385 = OpLoad %202 
                                Uniform f32* %387 = OpAccessChain %17 %386 
                                         f32 %388 = OpLoad %387 
                                Uniform f32* %389 = OpAccessChain %17 %386 
                                         f32 %390 = OpLoad %389 
                                Uniform f32* %391 = OpAccessChain %17 %386 
                                         f32 %392 = OpLoad %391 
                                       f32_3 %393 = OpCompositeConstruct %388 %390 %392 
                                         f32 %394 = OpCompositeExtract %393 0 
                                         f32 %395 = OpCompositeExtract %393 1 
                                         f32 %396 = OpCompositeExtract %393 2 
                                       f32_3 %397 = OpCompositeConstruct %394 %395 %396 
                                       f32_3 %398 = OpFMul %385 %397 
                                                      OpStore %202 %398 
                                       f32_3 %399 = OpLoad %202 
                                       f32_2 %400 = OpLoad %32 
                                       f32_3 %401 = OpVectorShuffle %400 %400 0 0 0 
                                       f32_3 %402 = OpFMul %399 %401 
                                       f32_4 %403 = OpLoad %9 
                                       f32_3 %404 = OpVectorShuffle %403 %403 0 0 0 
                                       f32_3 %405 = OpFAdd %402 %404 
                                                      OpStore %202 %405 
                              Uniform f32_4* %408 = OpAccessChain %17 %407 
                                       f32_4 %409 = OpLoad %408 
                                       f32_3 %410 = OpVectorShuffle %409 %409 0 1 2 
                                Uniform f32* %412 = OpAccessChain %17 %411 
                                         f32 %413 = OpLoad %412 
                                       f32_3 %414 = OpCompositeConstruct %413 %413 %413 
                                       f32_3 %415 = OpFMul %410 %414 
                                                      OpStore %406 %415 
                                       f32_3 %416 = OpLoad %406 
                                       f32_2 %417 = OpLoad %32 
                                       f32_3 %418 = OpVectorShuffle %417 %417 0 0 0 
                                       f32_3 %419 = OpFMul %416 %418 
                                       f32_3 %420 = OpLoad %202 
                                       f32_3 %421 = OpFAdd %419 %420 
                                                      OpStore %202 %421 
                                       f32_3 %422 = OpLoad %92 
                                       f32_3 %423 = OpVectorShuffle %422 %422 0 0 0 
                              Uniform f32_4* %425 = OpAccessChain %17 %424 
                                       f32_4 %426 = OpLoad %425 
                                       f32_3 %427 = OpVectorShuffle %426 %426 0 1 2 
                                       f32_3 %428 = OpFMul %423 %427 
                                       f32_3 %429 = OpLoad %202 
                                       f32_3 %430 = OpFAdd %428 %429 
                                       f32_4 %431 = OpLoad %9 
                                       f32_4 %432 = OpVectorShuffle %431 %430 4 5 2 6 
                                                      OpStore %9 %432 
                                Uniform f32* %434 = OpAccessChain %17 %433 
                                         f32 %435 = OpLoad %434 
                                         f32 %436 = OpFAdd %435 %37 
                                Private f32* %437 = OpAccessChain %111 %40 
                                                      OpStore %437 %436 
                                       f32_3 %438 = OpLoad %54 
                                       f32_2 %439 = OpVectorShuffle %438 %438 0 1 
                                       f32_2 %440 = OpLoad %111 
                                       f32_2 %441 = OpVectorShuffle %440 %440 0 0 
                                       f32_2 %442 = OpFMul %439 %441 
                                       f32_3 %443 = OpLoad %54 
                                       f32_3 %444 = OpVectorShuffle %443 %442 3 4 2 
                                                      OpStore %54 %444 
                                       f32_4 %445 = OpLoad %11 
                                       f32_2 %446 = OpVectorShuffle %445 %445 0 1 
                              Uniform f32_4* %448 = OpAccessChain %17 %447 
                                       f32_4 %449 = OpLoad %448 
                                       f32_2 %450 = OpVectorShuffle %449 %449 0 1 
                                       f32_2 %451 = OpFMul %446 %450 
                              Uniform f32_4* %452 = OpAccessChain %17 %447 
                                       f32_4 %453 = OpLoad %452 
                                       f32_2 %454 = OpVectorShuffle %453 %453 2 3 
                                       f32_2 %455 = OpFAdd %451 %454 
                                                      OpStore %111 %455 
                                       f32_3 %456 = OpLoad %54 
                                       f32_2 %457 = OpVectorShuffle %456 %456 0 1 
                                       f32_2 %458 = OpFMul %457 %69 
                                       f32_2 %459 = OpLoad %111 
                                       f32_2 %460 = OpFAdd %458 %459 
                                       f32_3 %461 = OpLoad %54 
                                       f32_3 %462 = OpVectorShuffle %461 %460 3 4 2 
                                                      OpStore %54 %462 
                  read_only Texture2DSampled %465 = OpLoad %464 
                                       f32_3 %466 = OpLoad %54 
                                       f32_2 %467 = OpVectorShuffle %466 %466 0 1 
                                       f32_4 %468 = OpImageSampleImplicitLod %465 %467 
                                         f32 %469 = OpCompositeExtract %468 0 
                                                      OpStore %463 %469 
                                         f32 %470 = OpLoad %463 
                                Uniform f32* %472 = OpAccessChain %17 %471 
                                         f32 %473 = OpLoad %472 
                                         f32 %474 = OpFMul %470 %473 
                                Private f32* %475 = OpAccessChain %54 %40 
                                                      OpStore %475 %474 
                                       f32_4 %476 = OpLoad %11 
                                       f32_2 %477 = OpVectorShuffle %476 %476 0 1 
                              Uniform f32_4* %479 = OpAccessChain %17 %478 
                                       f32_4 %480 = OpLoad %479 
                                       f32_2 %481 = OpVectorShuffle %480 %480 0 1 
                                       f32_2 %482 = OpFMul %477 %481 
                              Uniform f32_4* %483 = OpAccessChain %17 %478 
                                       f32_4 %484 = OpLoad %483 
                                       f32_2 %485 = OpVectorShuffle %484 %484 2 3 
                                       f32_2 %486 = OpFAdd %482 %485 
                                       f32_3 %487 = OpLoad %202 
                                       f32_3 %488 = OpVectorShuffle %487 %486 0 3 4 
                                                      OpStore %202 %488 
                                Uniform f32* %490 = OpAccessChain %17 %133 %489 
                                         f32 %491 = OpLoad %490 
                                Uniform f32* %493 = OpAccessChain %17 %492 
                                         f32 %494 = OpLoad %493 
                                         f32 %495 = OpFMul %491 %494 
                                Private f32* %496 = OpAccessChain %202 %489 
                                         f32 %497 = OpLoad %496 
                                         f32 %498 = OpFAdd %495 %497 
                                Private f32* %499 = OpAccessChain %202 %40 
                                                      OpStore %499 %498 
                  read_only Texture2DSampled %502 = OpLoad %501 
                                       f32_3 %503 = OpLoad %202 
                                       f32_2 %504 = OpVectorShuffle %503 %503 0 2 
                                       f32_4 %505 = OpImageSampleImplicitLod %502 %504 
                                       f32_3 %506 = OpVectorShuffle %505 %505 0 1 2 
                                                      OpStore %500 %506 
                                       f32_3 %507 = OpLoad %500 
                                       f32_3 %508 = OpLoad %54 
                                       f32_3 %509 = OpVectorShuffle %508 %508 0 0 0 
                                       f32_3 %510 = OpFMul %507 %509 
                                                      OpStore %54 %510 
                                       f32_3 %511 = OpLoad %54 
                                       f32_2 %512 = OpLoad %32 
                                       f32_3 %513 = OpVectorShuffle %512 %512 0 0 0 
                                       f32_3 %514 = OpFMul %511 %513 
                                       f32_4 %515 = OpLoad %9 
                                       f32_3 %516 = OpVectorShuffle %515 %515 0 1 3 
                                       f32_3 %517 = OpFAdd %514 %516 
                                       f32_4 %518 = OpLoad %9 
                                       f32_4 %519 = OpVectorShuffle %518 %517 4 5 6 3 
                                                      OpStore %9 %519 
                                       f32_4 %520 = OpLoad %9 
                                       f32_3 %521 = OpVectorShuffle %520 %520 0 1 2 
                                       f32_3 %522 = OpCompositeConstruct %299 %299 %299 
                                       f32_3 %523 = OpCompositeConstruct %300 %300 %300 
                                       f32_3 %524 = OpExtInst %1 43 %521 %522 %523 
                                       f32_4 %525 = OpLoad %9 
                                       f32_4 %526 = OpVectorShuffle %525 %524 4 5 6 3 
                                                      OpStore %9 %526 
                                       f32_4 %527 = OpLoad %9 
                                       f32_3 %528 = OpVectorShuffle %527 %527 0 1 2 
                                Uniform f32* %530 = OpAccessChain %17 %529 
                                         f32 %531 = OpLoad %530 
                                Uniform f32* %532 = OpAccessChain %17 %529 
                                         f32 %533 = OpLoad %532 
                                Uniform f32* %534 = OpAccessChain %17 %529 
                                         f32 %535 = OpLoad %534 
                                       f32_3 %536 = OpCompositeConstruct %531 %533 %535 
                                         f32 %537 = OpCompositeExtract %536 0 
                                         f32 %538 = OpCompositeExtract %536 1 
                                         f32 %539 = OpCompositeExtract %536 2 
                                       f32_3 %540 = OpCompositeConstruct %537 %538 %539 
                                       f32_3 %541 = OpFMul %528 %540 
                                       f32_4 %542 = OpLoad %9 
                                       f32_4 %543 = OpVectorShuffle %542 %541 4 5 6 3 
                                                      OpStore %9 %543 
                                  Input f32* %545 = OpAccessChain %11 %489 
                                         f32 %546 = OpLoad %545 
                                Uniform f32* %548 = OpAccessChain %17 %547 
                                         f32 %549 = OpLoad %548 
                                         f32 %550 = OpFMul %546 %549 
                                Uniform f32* %552 = OpAccessChain %17 %551 
                                         f32 %553 = OpLoad %552 
                                         f32 %554 = OpFAdd %550 %553 
                                Private f32* %555 = OpAccessChain %54 %40 
                                                      OpStore %555 %554 
                                Private f32* %556 = OpAccessChain %9 %40 
                                         f32 %557 = OpLoad %556 
                                Private f32* %558 = OpAccessChain %54 %40 
                                         f32 %559 = OpLoad %558 
                                         f32 %560 = OpFMul %557 %559 
                                Private f32* %562 = OpAccessChain %9 %561 
                                                      OpStore %562 %560 
                                Private f32* %563 = OpAccessChain %9 %561 
                                         f32 %564 = OpLoad %563 
                                         f32 %565 = OpExtInst %1 43 %564 %299 %300 
                                Private f32* %566 = OpAccessChain %9 %561 
                                                      OpStore %566 %565 
                                       f32_4 %569 = OpLoad %9 
                                                      OpStore %568 %569 
                                                      OpReturn
                                                      OpFunctionEnd
"
}
SubProgram "d3d11 " {
Keywords { "FOG_HEIGHT" }
"// shader disassembly not supported on DXBC"
}
SubProgram "vulkan " {
Keywords { "FOG_HEIGHT" }
"; SPIR-V
; Version: 1.0
; Generator: Khronos Glslang Reference Front End; 1
; Bound: 337
; Schema: 0
                                                      OpCapability Shader 
                                               %1 = OpExtInstImport "GLSL.std.450" 
                                                      OpMemoryModel Logical GLSL450 
                                                      OpEntryPoint Vertex %4 "main" %11 %82 %105 %106 %108 %109 %111 %112 %114 %115 %117 %185 %233 %320 
                                                      OpDecorate %11 Location 11 
                                                      OpDecorate %17 ArrayStride 17 
                                                      OpDecorate %18 ArrayStride 18 
                                                      OpDecorate %19 ArrayStride 19 
                                                      OpMemberDecorate %20 0 Offset 20 
                                                      OpMemberDecorate %20 1 Offset 20 
                                                      OpMemberDecorate %20 2 Offset 20 
                                                      OpMemberDecorate %20 3 Offset 20 
                                                      OpMemberDecorate %20 4 Offset 20 
                                                      OpMemberDecorate %20 5 RelaxedPrecision 
                                                      OpMemberDecorate %20 5 Offset 20 
                                                      OpDecorate %20 Block 
                                                      OpDecorate %22 DescriptorSet 22 
                                                      OpDecorate %22 Binding 22 
                                                      OpMemberDecorate %80 0 BuiltIn 80 
                                                      OpMemberDecorate %80 1 BuiltIn 80 
                                                      OpMemberDecorate %80 2 BuiltIn 80 
                                                      OpDecorate %80 Block 
                                                      OpDecorate %86 RelaxedPrecision 
                                                      OpDecorate %87 RelaxedPrecision 
                                                      OpDecorate %105 Location 105 
                                                      OpDecorate %106 Location 106 
                                                      OpDecorate %108 Location 108 
                                                      OpDecorate %109 Location 109 
                                                      OpDecorate %111 Location 111 
                                                      OpDecorate %112 Location 112 
                                                      OpDecorate %114 Location 114 
                                                      OpDecorate %115 Location 115 
                                                      OpDecorate %117 Location 117 
                                                      OpDecorate %185 Location 185 
                                                      OpDecorate %233 Location 233 
                                                      OpDecorate %320 Location 320 
                                               %2 = OpTypeVoid 
                                               %3 = OpTypeFunction %2 
                                               %6 = OpTypeFloat 32 
                                               %7 = OpTypeVector %6 4 
                                               %8 = OpTypePointer Private %7 
                                Private f32_4* %9 = OpVariable Private 
                                              %10 = OpTypePointer Input %7 
                                 Input f32_4* %11 = OpVariable Input 
                                              %14 = OpTypeVector %6 3 
                                              %15 = OpTypeInt 32 0 
                                          u32 %16 = OpConstant 4 
                                              %17 = OpTypeArray %7 %16 
                                              %18 = OpTypeArray %7 %16 
                                              %19 = OpTypeArray %7 %16 
                                              %20 = OpTypeStruct %14 %17 %18 %7 %19 %6 
                                              %21 = OpTypePointer Uniform %20 
Uniform struct {f32_3; f32_4[4]; f32_4[4]; f32_4; f32_4[4]; f32;}* %22 = OpVariable Uniform 
                                              %23 = OpTypeInt 32 1 
                                          i32 %24 = OpConstant 1 
                                              %25 = OpTypePointer Uniform %7 
                                          i32 %29 = OpConstant 0 
                                          i32 %37 = OpConstant 2 
                                          i32 %46 = OpConstant 3 
                               Private f32_4* %50 = OpVariable Private 
                                          i32 %53 = OpConstant 4 
                                          u32 %78 = OpConstant 1 
                                              %79 = OpTypeArray %6 %78 
                                              %80 = OpTypeStruct %7 %6 %79 
                                              %81 = OpTypePointer Output %80 
         Output struct {f32_4; f32; f32[1];}* %82 = OpVariable Output 
                                          i32 %83 = OpConstant 5 
                                              %84 = OpTypePointer Uniform %6 
                                          u32 %88 = OpConstant 3 
                                              %89 = OpTypePointer Private %6 
                                          u32 %93 = OpConstant 2 
                                              %97 = OpTypePointer Output %6 
                                             %101 = OpTypePointer Output %7 
                               Output f32_4* %105 = OpVariable Output 
                                Input f32_4* %106 = OpVariable Input 
                               Output f32_4* %108 = OpVariable Output 
                                Input f32_4* %109 = OpVariable Input 
                               Output f32_4* %111 = OpVariable Output 
                                Input f32_4* %112 = OpVariable Input 
                               Output f32_4* %114 = OpVariable Output 
                                Input f32_4* %115 = OpVariable Input 
                               Output f32_4* %117 = OpVariable Output 
                                         f32 %118 = OpConstant 3.674022E-40 
                                       f32_4 %119 = OpConstantComposite %118 %118 %118 %118 
                                             %164 = OpTypePointer Uniform %14 
                                Private f32* %170 = OpVariable Private 
                                Input f32_4* %185 = OpVariable Input 
                                             %230 = OpTypePointer Private %14 
                              Private f32_3* %231 = OpVariable Private 
                                             %232 = OpTypePointer Input %14 
                                Input f32_3* %233 = OpVariable Input 
                                         u32 %251 = OpConstant 0 
                              Private f32_3* %262 = OpVariable Private 
                                             %275 = OpTypePointer Input %6 
                              Private f32_3* %286 = OpVariable Private 
                               Output f32_4* %320 = OpVariable Output 
                                          void %4 = OpFunction None %3 
                                               %5 = OpLabel 
                                        f32_4 %12 = OpLoad %11 
                                        f32_4 %13 = OpVectorShuffle %12 %12 1 1 1 1 
                               Uniform f32_4* %26 = OpAccessChain %22 %24 %24 
                                        f32_4 %27 = OpLoad %26 
                                        f32_4 %28 = OpFMul %13 %27 
                                                      OpStore %9 %28 
                               Uniform f32_4* %30 = OpAccessChain %22 %24 %29 
                                        f32_4 %31 = OpLoad %30 
                                        f32_4 %32 = OpLoad %11 
                                        f32_4 %33 = OpVectorShuffle %32 %32 0 0 0 0 
                                        f32_4 %34 = OpFMul %31 %33 
                                        f32_4 %35 = OpLoad %9 
                                        f32_4 %36 = OpFAdd %34 %35 
                                                      OpStore %9 %36 
                               Uniform f32_4* %38 = OpAccessChain %22 %24 %37 
                                        f32_4 %39 = OpLoad %38 
                                        f32_4 %40 = OpLoad %11 
                                        f32_4 %41 = OpVectorShuffle %40 %40 2 2 2 2 
                                        f32_4 %42 = OpFMul %39 %41 
                                        f32_4 %43 = OpLoad %9 
                                        f32_4 %44 = OpFAdd %42 %43 
                                                      OpStore %9 %44 
                                        f32_4 %45 = OpLoad %9 
                               Uniform f32_4* %47 = OpAccessChain %22 %24 %46 
                                        f32_4 %48 = OpLoad %47 
                                        f32_4 %49 = OpFAdd %45 %48 
                                                      OpStore %9 %49 
                                        f32_4 %51 = OpLoad %9 
                                        f32_4 %52 = OpVectorShuffle %51 %51 1 1 1 1 
                               Uniform f32_4* %54 = OpAccessChain %22 %53 %24 
                                        f32_4 %55 = OpLoad %54 
                                        f32_4 %56 = OpFMul %52 %55 
                                                      OpStore %50 %56 
                               Uniform f32_4* %57 = OpAccessChain %22 %53 %29 
                                        f32_4 %58 = OpLoad %57 
                                        f32_4 %59 = OpLoad %9 
                                        f32_4 %60 = OpVectorShuffle %59 %59 0 0 0 0 
                                        f32_4 %61 = OpFMul %58 %60 
                                        f32_4 %62 = OpLoad %50 
                                        f32_4 %63 = OpFAdd %61 %62 
                                                      OpStore %50 %63 
                               Uniform f32_4* %64 = OpAccessChain %22 %53 %37 
                                        f32_4 %65 = OpLoad %64 
                                        f32_4 %66 = OpLoad %9 
                                        f32_4 %67 = OpVectorShuffle %66 %66 2 2 2 2 
                                        f32_4 %68 = OpFMul %65 %67 
                                        f32_4 %69 = OpLoad %50 
                                        f32_4 %70 = OpFAdd %68 %69 
                                                      OpStore %50 %70 
                               Uniform f32_4* %71 = OpAccessChain %22 %53 %46 
                                        f32_4 %72 = OpLoad %71 
                                        f32_4 %73 = OpLoad %9 
                                        f32_4 %74 = OpVectorShuffle %73 %73 3 3 3 3 
                                        f32_4 %75 = OpFMul %72 %74 
                                        f32_4 %76 = OpLoad %50 
                                        f32_4 %77 = OpFAdd %75 %76 
                                                      OpStore %9 %77 
                                 Uniform f32* %85 = OpAccessChain %22 %83 
                                          f32 %86 = OpLoad %85 
                                          f32 %87 = OpFNegate %86 
                                 Private f32* %90 = OpAccessChain %9 %88 
                                          f32 %91 = OpLoad %90 
                                          f32 %92 = OpFMul %87 %91 
                                 Private f32* %94 = OpAccessChain %9 %93 
                                          f32 %95 = OpLoad %94 
                                          f32 %96 = OpFAdd %92 %95 
                                  Output f32* %98 = OpAccessChain %82 %29 %93 
                                                      OpStore %98 %96 
                                        f32_4 %99 = OpLoad %9 
                                       f32_3 %100 = OpVectorShuffle %99 %99 0 1 3 
                               Output f32_4* %102 = OpAccessChain %82 %29 
                                       f32_4 %103 = OpLoad %102 
                                       f32_4 %104 = OpVectorShuffle %103 %100 4 5 2 6 
                                                      OpStore %102 %104 
                                       f32_4 %107 = OpLoad %106 
                                                      OpStore %105 %107 
                                       f32_4 %110 = OpLoad %109 
                                                      OpStore %108 %110 
                                       f32_4 %113 = OpLoad %112 
                                                      OpStore %111 %113 
                                       f32_4 %116 = OpLoad %115 
                                                      OpStore %114 %116 
                                                      OpStore %117 %119 
                                       f32_4 %120 = OpLoad %11 
                                       f32_3 %121 = OpVectorShuffle %120 %120 1 1 1 
                              Uniform f32_4* %122 = OpAccessChain %22 %24 %24 
                                       f32_4 %123 = OpLoad %122 
                                       f32_3 %124 = OpVectorShuffle %123 %123 0 1 2 
                                       f32_3 %125 = OpFMul %121 %124 
                                       f32_4 %126 = OpLoad %9 
                                       f32_4 %127 = OpVectorShuffle %126 %125 4 5 6 3 
                                                      OpStore %9 %127 
                              Uniform f32_4* %128 = OpAccessChain %22 %24 %29 
                                       f32_4 %129 = OpLoad %128 
                                       f32_3 %130 = OpVectorShuffle %129 %129 0 1 2 
                                       f32_4 %131 = OpLoad %11 
                                       f32_3 %132 = OpVectorShuffle %131 %131 0 0 0 
                                       f32_3 %133 = OpFMul %130 %132 
                                       f32_4 %134 = OpLoad %9 
                                       f32_3 %135 = OpVectorShuffle %134 %134 0 1 2 
                                       f32_3 %136 = OpFAdd %133 %135 
                                       f32_4 %137 = OpLoad %9 
                                       f32_4 %138 = OpVectorShuffle %137 %136 4 5 6 3 
                                                      OpStore %9 %138 
                              Uniform f32_4* %139 = OpAccessChain %22 %24 %37 
                                       f32_4 %140 = OpLoad %139 
                                       f32_3 %141 = OpVectorShuffle %140 %140 0 1 2 
                                       f32_4 %142 = OpLoad %11 
                                       f32_3 %143 = OpVectorShuffle %142 %142 2 2 2 
                                       f32_3 %144 = OpFMul %141 %143 
                                       f32_4 %145 = OpLoad %9 
                                       f32_3 %146 = OpVectorShuffle %145 %145 0 1 2 
                                       f32_3 %147 = OpFAdd %144 %146 
                                       f32_4 %148 = OpLoad %9 
                                       f32_4 %149 = OpVectorShuffle %148 %147 4 5 6 3 
                                                      OpStore %9 %149 
                              Uniform f32_4* %150 = OpAccessChain %22 %24 %46 
                                       f32_4 %151 = OpLoad %150 
                                       f32_3 %152 = OpVectorShuffle %151 %151 0 1 2 
                                       f32_4 %153 = OpLoad %11 
                                       f32_3 %154 = OpVectorShuffle %153 %153 3 3 3 
                                       f32_3 %155 = OpFMul %152 %154 
                                       f32_4 %156 = OpLoad %9 
                                       f32_3 %157 = OpVectorShuffle %156 %156 0 1 2 
                                       f32_3 %158 = OpFAdd %155 %157 
                                       f32_4 %159 = OpLoad %9 
                                       f32_4 %160 = OpVectorShuffle %159 %158 4 5 6 3 
                                                      OpStore %9 %160 
                                       f32_4 %161 = OpLoad %9 
                                       f32_3 %162 = OpVectorShuffle %161 %161 0 1 2 
                                       f32_3 %163 = OpFNegate %162 
                              Uniform f32_3* %165 = OpAccessChain %22 %29 
                                       f32_3 %166 = OpLoad %165 
                                       f32_3 %167 = OpFAdd %163 %166 
                                       f32_4 %168 = OpLoad %9 
                                       f32_4 %169 = OpVectorShuffle %168 %167 4 5 6 3 
                                                      OpStore %9 %169 
                                       f32_4 %171 = OpLoad %9 
                                       f32_3 %172 = OpVectorShuffle %171 %171 0 1 2 
                                       f32_4 %173 = OpLoad %9 
                                       f32_3 %174 = OpVectorShuffle %173 %173 0 1 2 
                                         f32 %175 = OpDot %172 %174 
                                                      OpStore %170 %175 
                                         f32 %176 = OpLoad %170 
                                         f32 %177 = OpExtInst %1 32 %176 
                                                      OpStore %170 %177 
                                         f32 %178 = OpLoad %170 
                                       f32_3 %179 = OpCompositeConstruct %178 %178 %178 
                                       f32_4 %180 = OpLoad %9 
                                       f32_3 %181 = OpVectorShuffle %180 %180 0 1 2 
                                       f32_3 %182 = OpFMul %179 %181 
                                       f32_4 %183 = OpLoad %9 
                                       f32_4 %184 = OpVectorShuffle %183 %182 4 5 6 3 
                                                      OpStore %9 %184 
                                       f32_4 %186 = OpLoad %185 
                                       f32_3 %187 = OpVectorShuffle %186 %186 1 1 1 
                              Uniform f32_4* %188 = OpAccessChain %22 %24 %24 
                                       f32_4 %189 = OpLoad %188 
                                       f32_3 %190 = OpVectorShuffle %189 %189 1 2 0 
                                       f32_3 %191 = OpFMul %187 %190 
                                       f32_4 %192 = OpLoad %50 
                                       f32_4 %193 = OpVectorShuffle %192 %191 4 5 6 3 
                                                      OpStore %50 %193 
                              Uniform f32_4* %194 = OpAccessChain %22 %24 %29 
                                       f32_4 %195 = OpLoad %194 
                                       f32_3 %196 = OpVectorShuffle %195 %195 1 2 0 
                                       f32_4 %197 = OpLoad %185 
                                       f32_3 %198 = OpVectorShuffle %197 %197 0 0 0 
                                       f32_3 %199 = OpFMul %196 %198 
                                       f32_4 %200 = OpLoad %50 
                                       f32_3 %201 = OpVectorShuffle %200 %200 0 1 2 
                                       f32_3 %202 = OpFAdd %199 %201 
                                       f32_4 %203 = OpLoad %50 
                                       f32_4 %204 = OpVectorShuffle %203 %202 4 5 6 3 
                                                      OpStore %50 %204 
                              Uniform f32_4* %205 = OpAccessChain %22 %24 %37 
                                       f32_4 %206 = OpLoad %205 
                                       f32_3 %207 = OpVectorShuffle %206 %206 1 2 0 
                                       f32_4 %208 = OpLoad %185 
                                       f32_3 %209 = OpVectorShuffle %208 %208 2 2 2 
                                       f32_3 %210 = OpFMul %207 %209 
                                       f32_4 %211 = OpLoad %50 
                                       f32_3 %212 = OpVectorShuffle %211 %211 0 1 2 
                                       f32_3 %213 = OpFAdd %210 %212 
                                       f32_4 %214 = OpLoad %50 
                                       f32_4 %215 = OpVectorShuffle %214 %213 4 5 6 3 
                                                      OpStore %50 %215 
                                       f32_4 %216 = OpLoad %50 
                                       f32_3 %217 = OpVectorShuffle %216 %216 0 1 2 
                                       f32_4 %218 = OpLoad %50 
                                       f32_3 %219 = OpVectorShuffle %218 %218 0 1 2 
                                         f32 %220 = OpDot %217 %219 
                                                      OpStore %170 %220 
                                         f32 %221 = OpLoad %170 
                                         f32 %222 = OpExtInst %1 32 %221 
                                                      OpStore %170 %222 
                                         f32 %223 = OpLoad %170 
                                       f32_3 %224 = OpCompositeConstruct %223 %223 %223 
                                       f32_4 %225 = OpLoad %50 
                                       f32_3 %226 = OpVectorShuffle %225 %225 1 0 2 
                                       f32_3 %227 = OpFMul %224 %226 
                                       f32_4 %228 = OpLoad %50 
                                       f32_4 %229 = OpVectorShuffle %228 %227 4 5 6 3 
                                                      OpStore %50 %229 
                                       f32_3 %234 = OpLoad %233 
                              Uniform f32_4* %235 = OpAccessChain %22 %37 %29 
                                       f32_4 %236 = OpLoad %235 
                                       f32_3 %237 = OpVectorShuffle %236 %236 0 1 2 
                                         f32 %238 = OpDot %234 %237 
                                Private f32* %239 = OpAccessChain %231 %78 
                                                      OpStore %239 %238 
                                       f32_3 %240 = OpLoad %233 
                              Uniform f32_4* %241 = OpAccessChain %22 %37 %24 
                                       f32_4 %242 = OpLoad %241 
                                       f32_3 %243 = OpVectorShuffle %242 %242 0 1 2 
                                         f32 %244 = OpDot %240 %243 
                                Private f32* %245 = OpAccessChain %231 %93 
                                                      OpStore %245 %244 
                                       f32_3 %246 = OpLoad %233 
                              Uniform f32_4* %247 = OpAccessChain %22 %37 %37 
                                       f32_4 %248 = OpLoad %247 
                                       f32_3 %249 = OpVectorShuffle %248 %248 0 1 2 
                                         f32 %250 = OpDot %246 %249 
                                Private f32* %252 = OpAccessChain %231 %251 
                                                      OpStore %252 %250 
                                       f32_3 %253 = OpLoad %231 
                                       f32_3 %254 = OpLoad %231 
                                         f32 %255 = OpDot %253 %254 
                                                      OpStore %170 %255 
                                         f32 %256 = OpLoad %170 
                                         f32 %257 = OpExtInst %1 32 %256 
                                                      OpStore %170 %257 
                                         f32 %258 = OpLoad %170 
                                       f32_3 %259 = OpCompositeConstruct %258 %258 %258 
                                       f32_3 %260 = OpLoad %231 
                                       f32_3 %261 = OpFMul %259 %260 
                                                      OpStore %231 %261 
                                       f32_4 %263 = OpLoad %50 
                                       f32_3 %264 = OpVectorShuffle %263 %263 1 0 2 
                                       f32_3 %265 = OpLoad %231 
                                       f32_3 %266 = OpFMul %264 %265 
                                                      OpStore %262 %266 
                                       f32_3 %267 = OpLoad %231 
                                       f32_3 %268 = OpVectorShuffle %267 %267 2 0 1 
                                       f32_4 %269 = OpLoad %50 
                                       f32_3 %270 = OpVectorShuffle %269 %269 0 2 1 
                                       f32_3 %271 = OpFMul %268 %270 
                                       f32_3 %272 = OpLoad %262 
                                       f32_3 %273 = OpFNegate %272 
                                       f32_3 %274 = OpFAdd %271 %273 
                                                      OpStore %262 %274 
                                  Input f32* %276 = OpAccessChain %185 %88 
                                         f32 %277 = OpLoad %276 
                                Uniform f32* %278 = OpAccessChain %22 %46 %88 
                                         f32 %279 = OpLoad %278 
                                         f32 %280 = OpFMul %277 %279 
                                                      OpStore %170 %280 
                                         f32 %281 = OpLoad %170 
                                       f32_3 %282 = OpCompositeConstruct %281 %281 %281 
                                       f32_3 %283 = OpLoad %262 
                                       f32_3 %284 = OpVectorShuffle %283 %283 1 0 2 
                                       f32_3 %285 = OpFMul %282 %284 
                                                      OpStore %262 %285 
                                Private f32* %287 = OpAccessChain %262 %251 
                                         f32 %288 = OpLoad %287 
                                Private f32* %289 = OpAccessChain %286 %78 
                                                      OpStore %289 %288 
                                Private f32* %290 = OpAccessChain %50 %78 
                                         f32 %291 = OpLoad %290 
                                Private f32* %292 = OpAccessChain %286 %251 
                                                      OpStore %292 %291 
                                Private f32* %293 = OpAccessChain %231 %93 
                                         f32 %294 = OpLoad %293 
                                Private f32* %295 = OpAccessChain %286 %93 
                                                      OpStore %295 %294 
                                       f32_4 %296 = OpLoad %9 
                                       f32_3 %297 = OpVectorShuffle %296 %296 1 1 1 
                                       f32_3 %298 = OpLoad %286 
                                       f32_3 %299 = OpFMul %297 %298 
                                                      OpStore %286 %299 
                                Private f32* %300 = OpAccessChain %262 %93 
                                         f32 %301 = OpLoad %300 
                                Private f32* %302 = OpAccessChain %50 %78 
                                                      OpStore %302 %301 
                                Private f32* %303 = OpAccessChain %50 %93 
                                         f32 %304 = OpLoad %303 
                                Private f32* %305 = OpAccessChain %262 %251 
                                                      OpStore %305 %304 
                                Private f32* %306 = OpAccessChain %231 %78 
                                         f32 %307 = OpLoad %306 
                                Private f32* %308 = OpAccessChain %262 %93 
                                                      OpStore %308 %307 
                                Private f32* %309 = OpAccessChain %231 %251 
                                         f32 %310 = OpLoad %309 
                                Private f32* %311 = OpAccessChain %50 %93 
                                                      OpStore %311 %310 
                                       f32_3 %312 = OpLoad %262 
                                       f32_4 %313 = OpLoad %9 
                                       f32_3 %314 = OpVectorShuffle %313 %313 0 0 0 
                                       f32_3 %315 = OpFMul %312 %314 
                                       f32_3 %316 = OpLoad %286 
                                       f32_3 %317 = OpFAdd %315 %316 
                                       f32_4 %318 = OpLoad %9 
                                       f32_4 %319 = OpVectorShuffle %318 %317 4 5 2 6 
                                                      OpStore %9 %319 
                                       f32_4 %321 = OpLoad %50 
                                       f32_3 %322 = OpVectorShuffle %321 %321 0 1 2 
                                       f32_4 %323 = OpLoad %9 
                                       f32_3 %324 = OpVectorShuffle %323 %323 2 2 2 
                                       f32_3 %325 = OpFMul %322 %324 
                                       f32_4 %326 = OpLoad %9 
                                       f32_3 %327 = OpVectorShuffle %326 %326 0 1 3 
                                       f32_3 %328 = OpFAdd %325 %327 
                                       f32_4 %329 = OpLoad %320 
                                       f32_4 %330 = OpVectorShuffle %329 %328 4 5 6 3 
                                                      OpStore %320 %330 
                                 Output f32* %331 = OpAccessChain %320 %88 
                                                      OpStore %331 %118 
                                 Output f32* %332 = OpAccessChain %82 %29 %78 
                                         f32 %333 = OpLoad %332 
                                         f32 %334 = OpFNegate %333 
                                 Output f32* %335 = OpAccessChain %82 %29 %78 
                                                      OpStore %335 %334 
                                                      OpReturn
                                                      OpFunctionEnd
; SPIR-V
; Version: 1.0
; Generator: Khronos Glslang Reference Front End; 1
; Bound: 571
; Schema: 0
                                                      OpCapability Shader 
                                               %1 = OpExtInstImport "GLSL.std.450" 
                                                      OpMemoryModel Logical GLSL450 
                                                      OpEntryPoint Fragment %4 "main" %11 %44 %568 
                                                      OpExecutionMode %4 OriginUpperLeft 
                                                      OpDecorate %11 Location 11 
                                                      OpMemberDecorate %15 0 Offset 15 
                                                      OpMemberDecorate %15 1 Offset 15 
                                                      OpMemberDecorate %15 2 Offset 15 
                                                      OpMemberDecorate %15 3 RelaxedPrecision 
                                                      OpMemberDecorate %15 3 Offset 15 
                                                      OpMemberDecorate %15 4 RelaxedPrecision 
                                                      OpMemberDecorate %15 4 Offset 15 
                                                      OpMemberDecorate %15 5 Offset 15 
                                                      OpMemberDecorate %15 6 Offset 15 
                                                      OpMemberDecorate %15 7 Offset 15 
                                                      OpMemberDecorate %15 8 Offset 15 
                                                      OpMemberDecorate %15 9 Offset 15 
                                                      OpMemberDecorate %15 10 Offset 15 
                                                      OpMemberDecorate %15 11 Offset 15 
                                                      OpMemberDecorate %15 12 Offset 15 
                                                      OpMemberDecorate %15 13 Offset 15 
                                                      OpMemberDecorate %15 14 Offset 15 
                                                      OpMemberDecorate %15 15 Offset 15 
                                                      OpMemberDecorate %15 16 Offset 15 
                                                      OpMemberDecorate %15 17 Offset 15 
                                                      OpMemberDecorate %15 18 Offset 15 
                                                      OpMemberDecorate %15 19 Offset 15 
                                                      OpMemberDecorate %15 20 Offset 15 
                                                      OpMemberDecorate %15 21 Offset 15 
                                                      OpMemberDecorate %15 22 Offset 15 
                                                      OpMemberDecorate %15 23 Offset 15 
                                                      OpMemberDecorate %15 24 Offset 15 
                                                      OpMemberDecorate %15 25 Offset 15 
                                                      OpMemberDecorate %15 26 Offset 15 
                                                      OpMemberDecorate %15 27 Offset 15 
                                                      OpMemberDecorate %15 28 Offset 15 
                                                      OpMemberDecorate %15 29 RelaxedPrecision 
                                                      OpMemberDecorate %15 29 Offset 15 
                                                      OpMemberDecorate %15 30 RelaxedPrecision 
                                                      OpMemberDecorate %15 30 Offset 15 
                                                      OpDecorate %15 Block 
                                                      OpDecorate %17 DescriptorSet 17 
                                                      OpDecorate %17 Binding 17 
                                                      OpDecorate %44 Location 44 
                                                      OpDecorate %76 RelaxedPrecision 
                                                      OpDecorate %80 RelaxedPrecision 
                                                      OpDecorate %80 DescriptorSet 80 
                                                      OpDecorate %80 Binding 80 
                                                      OpDecorate %81 RelaxedPrecision 
                                                      OpDecorate %85 RelaxedPrecision 
                                                      OpDecorate %86 RelaxedPrecision 
                                                      OpDecorate %106 RelaxedPrecision 
                                                      OpDecorate %109 RelaxedPrecision 
                                                      OpDecorate %110 RelaxedPrecision 
                                                      OpDecorate %114 RelaxedPrecision 
                                                      OpDecorate %120 RelaxedPrecision 
                                                      OpDecorate %122 RelaxedPrecision 
                                                      OpDecorate %147 RelaxedPrecision 
                                                      OpDecorate %148 RelaxedPrecision 
                                                      OpDecorate %148 DescriptorSet 148 
                                                      OpDecorate %148 Binding 148 
                                                      OpDecorate %149 RelaxedPrecision 
                                                      OpDecorate %153 RelaxedPrecision 
                                                      OpDecorate %167 RelaxedPrecision 
                                                      OpDecorate %169 RelaxedPrecision 
                                                      OpDecorate %177 RelaxedPrecision 
                                                      OpDecorate %191 RelaxedPrecision 
                                                      OpDecorate %192 RelaxedPrecision 
                                                      OpDecorate %192 DescriptorSet 192 
                                                      OpDecorate %192 Binding 192 
                                                      OpDecorate %193 RelaxedPrecision 
                                                      OpDecorate %196 RelaxedPrecision 
                                                      OpDecorate %197 RelaxedPrecision 
                                                      OpDecorate %218 RelaxedPrecision 
                                                      OpDecorate %220 RelaxedPrecision 
                                                      OpDecorate %231 RelaxedPrecision 
                                                      OpDecorate %247 RelaxedPrecision 
                                                      OpDecorate %247 DescriptorSet 247 
                                                      OpDecorate %247 Binding 247 
                                                      OpDecorate %248 RelaxedPrecision 
                                                      OpDecorate %252 RelaxedPrecision 
                                                      OpDecorate %268 RelaxedPrecision 
                                                      OpDecorate %270 RelaxedPrecision 
                                                      OpDecorate %281 RelaxedPrecision 
                                                      OpDecorate %282 RelaxedPrecision 
                                                      OpDecorate %282 DescriptorSet 282 
                                                      OpDecorate %282 Binding 282 
                                                      OpDecorate %283 RelaxedPrecision 
                                                      OpDecorate %287 RelaxedPrecision 
                                                      OpDecorate %288 RelaxedPrecision 
                                                      OpDecorate %304 RelaxedPrecision 
                                                      OpDecorate %311 RelaxedPrecision 
                                                      OpDecorate %347 RelaxedPrecision 
                                                      OpDecorate %349 RelaxedPrecision 
                                                      OpDecorate %368 RelaxedPrecision 
                                                      OpDecorate %368 DescriptorSet 368 
                                                      OpDecorate %368 Binding 368 
                                                      OpDecorate %369 RelaxedPrecision 
                                                      OpDecorate %372 RelaxedPrecision 
                                                      OpDecorate %373 RelaxedPrecision 
                                                      OpDecorate %463 RelaxedPrecision 
                                                      OpDecorate %464 RelaxedPrecision 
                                                      OpDecorate %464 DescriptorSet 464 
                                                      OpDecorate %464 Binding 464 
                                                      OpDecorate %465 RelaxedPrecision 
                                                      OpDecorate %469 RelaxedPrecision 
                                                      OpDecorate %470 RelaxedPrecision 
                                                      OpDecorate %500 RelaxedPrecision 
                                                      OpDecorate %501 RelaxedPrecision 
                                                      OpDecorate %501 DescriptorSet 501 
                                                      OpDecorate %501 Binding 501 
                                                      OpDecorate %502 RelaxedPrecision 
                                                      OpDecorate %506 RelaxedPrecision 
                                                      OpDecorate %507 RelaxedPrecision 
                                                      OpDecorate %549 RelaxedPrecision 
                                                      OpDecorate %553 RelaxedPrecision 
                                                      OpDecorate %568 RelaxedPrecision 
                                                      OpDecorate %568 Location 568 
                                               %2 = OpTypeVoid 
                                               %3 = OpTypeFunction %2 
                                               %6 = OpTypeFloat 32 
                                               %7 = OpTypeVector %6 4 
                                               %8 = OpTypePointer Private %7 
                                Private f32_4* %9 = OpVariable Private 
                                              %10 = OpTypePointer Input %7 
                                 Input f32_4* %11 = OpVariable Input 
                                              %12 = OpTypeVector %6 2 
                                              %15 = OpTypeStruct %7 %7 %7 %6 %6 %6 %6 %6 %7 %7 %6 %6 %7 %6 %6 %7 %6 %7 %6 %7 %6 %6 %7 %6 %7 %6 %7 %6 %6 %6 %6 
                                              %16 = OpTypePointer Uniform %15 
Uniform struct {f32_4; f32_4; f32_4; f32; f32; f32; f32; f32; f32_4; f32_4; f32; f32; f32_4; f32; f32; f32_4; f32; f32_4; f32; f32_4; f32; f32; f32_4; f32; f32_4; f32; f32_4; f32; f32; f32; f32;}* %17 = OpVariable Uniform 
                                              %18 = OpTypeInt 32 1 
                                          i32 %19 = OpConstant 17 
                                              %20 = OpTypePointer Uniform %7 
                                              %31 = OpTypePointer Private %12 
                               Private f32_2* %32 = OpVariable Private 
                                          i32 %33 = OpConstant 18 
                                              %34 = OpTypePointer Uniform %6 
                                          f32 %37 = OpConstant 3.674022E-40 
                                              %39 = OpTypeInt 32 0 
                                          u32 %40 = OpConstant 0 
                                              %41 = OpTypePointer Private %6 
                                 Private f32* %43 = OpVariable Private 
                                 Input f32_4* %44 = OpVariable Input 
                                              %45 = OpTypeVector %6 3 
                                              %53 = OpTypePointer Private %45 
                               Private f32_3* %54 = OpVariable Private 
                                          f32 %68 = OpConstant 3.674022E-40 
                                        f32_2 %69 = OpConstantComposite %68 %68 
                                 Private f32* %76 = OpVariable Private 
                                              %77 = OpTypeImage %6 Dim2D 0 0 0 1 Unknown 
                                              %78 = OpTypeSampledImage %77 
                                              %79 = OpTypePointer UniformConstant %78 
  UniformConstant read_only Texture2DSampled* %80 = OpVariable UniformConstant 
                                          i32 %87 = OpConstant 16 
                               Private f32_3* %92 = OpVariable Private 
                                          i32 %95 = OpConstant 9 
                                Private f32* %106 = OpVariable Private 
                                         i32 %107 = OpConstant 3 
                              Private f32_2* %111 = OpVariable Private 
                                         i32 %118 = OpConstant 4 
                                         i32 %133 = OpConstant 0 
                                         i32 %137 = OpConstant 10 
                                Private f32* %147 = OpVariable Private 
 UniformConstant read_only Texture2DSampled* %148 = OpVariable UniformConstant 
                                         i32 %156 = OpConstant 8 
                                         i32 %179 = OpConstant 11 
                                Private f32* %191 = OpVariable Private 
 UniformConstant read_only Texture2DSampled* %192 = OpVariable UniformConstant 
                              Private f32_3* %202 = OpVariable Private 
                                         i32 %205 = OpConstant 15 
 UniformConstant read_only Texture2DSampled* %247 = OpVariable UniformConstant 
                                         i32 %255 = OpConstant 12 
                                Private f32* %281 = OpVariable Private 
 UniformConstant read_only Texture2DSampled* %282 = OpVariable UniformConstant 
                                         i32 %289 = OpConstant 13 
                                         i32 %294 = OpConstant 14 
                                         f32 %299 = OpConstant 3.674022E-40 
                                         f32 %300 = OpConstant 3.674022E-40 
                                         i32 %327 = OpConstant 21 
                                         i32 %334 = OpConstant 2 
                                         i32 %361 = OpConstant 5 
 UniformConstant read_only Texture2DSampled* %368 = OpVariable UniformConstant 
                                         i32 %374 = OpConstant 6 
                                         i32 %380 = OpConstant 1 
                                         i32 %386 = OpConstant 7 
                              Private f32_3* %406 = OpVariable Private 
                                         i32 %407 = OpConstant 19 
                                         i32 %411 = OpConstant 20 
                                         i32 %424 = OpConstant 22 
                                         i32 %433 = OpConstant 25 
                                         i32 %447 = OpConstant 24 
                                Private f32* %463 = OpVariable Private 
 UniformConstant read_only Texture2DSampled* %464 = OpVariable UniformConstant 
                                         i32 %471 = OpConstant 23 
                                         i32 %478 = OpConstant 26 
                                         u32 %489 = OpConstant 1 
                                         i32 %492 = OpConstant 27 
                              Private f32_3* %500 = OpVariable Private 
 UniformConstant read_only Texture2DSampled* %501 = OpVariable UniformConstant 
                                         i32 %529 = OpConstant 28 
                                             %544 = OpTypePointer Input %6 
                                         i32 %547 = OpConstant 29 
                                         i32 %551 = OpConstant 30 
                                         u32 %561 = OpConstant 3 
                                             %567 = OpTypePointer Output %7 
                               Output f32_4* %568 = OpVariable Output 
                                          void %4 = OpFunction None %3 
                                               %5 = OpLabel 
                                        f32_4 %13 = OpLoad %11 
                                        f32_2 %14 = OpVectorShuffle %13 %13 0 1 
                               Uniform f32_4* %21 = OpAccessChain %17 %19 
                                        f32_4 %22 = OpLoad %21 
                                        f32_2 %23 = OpVectorShuffle %22 %22 0 1 
                                        f32_2 %24 = OpFMul %14 %23 
                               Uniform f32_4* %25 = OpAccessChain %17 %19 
                                        f32_4 %26 = OpLoad %25 
                                        f32_2 %27 = OpVectorShuffle %26 %26 2 3 
                                        f32_2 %28 = OpFAdd %24 %27 
                                        f32_4 %29 = OpLoad %9 
                                        f32_4 %30 = OpVectorShuffle %29 %28 4 5 2 3 
                                                      OpStore %9 %30 
                                 Uniform f32* %35 = OpAccessChain %17 %33 
                                          f32 %36 = OpLoad %35 
                                          f32 %38 = OpFAdd %36 %37 
                                 Private f32* %42 = OpAccessChain %32 %40 
                                                      OpStore %42 %38 
                                        f32_4 %46 = OpLoad %44 
                                        f32_3 %47 = OpVectorShuffle %46 %46 0 1 2 
                                        f32_4 %48 = OpLoad %44 
                                        f32_3 %49 = OpVectorShuffle %48 %48 0 1 2 
                                          f32 %50 = OpDot %47 %49 
                                                      OpStore %43 %50 
                                          f32 %51 = OpLoad %43 
                                          f32 %52 = OpExtInst %1 32 %51 
                                                      OpStore %43 %52 
                                          f32 %55 = OpLoad %43 
                                        f32_2 %56 = OpCompositeConstruct %55 %55 
                                        f32_4 %57 = OpLoad %44 
                                        f32_2 %58 = OpVectorShuffle %57 %57 0 1 
                                        f32_2 %59 = OpFMul %56 %58 
                                        f32_3 %60 = OpLoad %54 
                                        f32_3 %61 = OpVectorShuffle %60 %59 3 4 2 
                                                      OpStore %54 %61 
                                        f32_2 %62 = OpLoad %32 
                                        f32_2 %63 = OpVectorShuffle %62 %62 0 0 
                                        f32_3 %64 = OpLoad %54 
                                        f32_2 %65 = OpVectorShuffle %64 %64 0 1 
                                        f32_2 %66 = OpFMul %63 %65 
                                                      OpStore %32 %66 
                                        f32_2 %67 = OpLoad %32 
                                        f32_2 %70 = OpFMul %67 %69 
                                        f32_4 %71 = OpLoad %9 
                                        f32_2 %72 = OpVectorShuffle %71 %71 0 1 
                                        f32_2 %73 = OpFAdd %70 %72 
                                        f32_4 %74 = OpLoad %9 
                                        f32_4 %75 = OpVectorShuffle %74 %73 4 5 2 3 
                                                      OpStore %9 %75 
                   read_only Texture2DSampled %81 = OpLoad %80 
                                        f32_4 %82 = OpLoad %9 
                                        f32_2 %83 = OpVectorShuffle %82 %82 0 1 
                                        f32_4 %84 = OpImageSampleImplicitLod %81 %83 
                                          f32 %85 = OpCompositeExtract %84 0 
                                                      OpStore %76 %85 
                                          f32 %86 = OpLoad %76 
                                 Uniform f32* %88 = OpAccessChain %17 %87 
                                          f32 %89 = OpLoad %88 
                                          f32 %90 = OpFMul %86 %89 
                                 Private f32* %91 = OpAccessChain %9 %40 
                                                      OpStore %91 %90 
                                        f32_4 %93 = OpLoad %11 
                                        f32_2 %94 = OpVectorShuffle %93 %93 0 1 
                               Uniform f32_4* %96 = OpAccessChain %17 %95 
                                        f32_4 %97 = OpLoad %96 
                                        f32_2 %98 = OpVectorShuffle %97 %97 0 1 
                                        f32_2 %99 = OpFMul %94 %98 
                              Uniform f32_4* %100 = OpAccessChain %17 %95 
                                       f32_4 %101 = OpLoad %100 
                                       f32_2 %102 = OpVectorShuffle %101 %101 2 3 
                                       f32_2 %103 = OpFAdd %99 %102 
                                       f32_3 %104 = OpLoad %92 
                                       f32_3 %105 = OpVectorShuffle %104 %103 3 4 2 
                                                      OpStore %92 %105 
                                Uniform f32* %108 = OpAccessChain %17 %107 
                                         f32 %109 = OpLoad %108 
                                         f32 %110 = OpFAdd %109 %37 
                                                      OpStore %106 %110 
                                       f32_3 %112 = OpLoad %54 
                                       f32_2 %113 = OpVectorShuffle %112 %112 0 1 
                                         f32 %114 = OpLoad %106 
                                       f32_2 %115 = OpCompositeConstruct %114 %114 
                                       f32_2 %116 = OpFMul %113 %115 
                                                      OpStore %111 %116 
                                       f32_2 %117 = OpLoad %111 
                                Uniform f32* %119 = OpAccessChain %17 %118 
                                         f32 %120 = OpLoad %119 
                                Uniform f32* %121 = OpAccessChain %17 %118 
                                         f32 %122 = OpLoad %121 
                                       f32_2 %123 = OpCompositeConstruct %120 %122 
                                         f32 %124 = OpCompositeExtract %123 0 
                                         f32 %125 = OpCompositeExtract %123 1 
                                       f32_2 %126 = OpCompositeConstruct %124 %125 
                                       f32_2 %127 = OpFMul %117 %126 
                                       f32_3 %128 = OpLoad %92 
                                       f32_2 %129 = OpVectorShuffle %128 %128 0 1 
                                       f32_2 %130 = OpFAdd %127 %129 
                                       f32_3 %131 = OpLoad %92 
                                       f32_3 %132 = OpVectorShuffle %131 %130 3 4 2 
                                                      OpStore %92 %132 
                              Uniform f32_4* %134 = OpAccessChain %17 %133 
                                       f32_4 %135 = OpLoad %134 
                                       f32_2 %136 = OpVectorShuffle %135 %135 1 1 
                                Uniform f32* %138 = OpAccessChain %17 %137 
                                         f32 %139 = OpLoad %138 
                                       f32_2 %140 = OpCompositeConstruct %139 %139 
                                       f32_2 %141 = OpFMul %136 %140 
                                       f32_3 %142 = OpLoad %92 
                                       f32_2 %143 = OpVectorShuffle %142 %142 0 1 
                                       f32_2 %144 = OpFAdd %141 %143 
                                       f32_3 %145 = OpLoad %92 
                                       f32_3 %146 = OpVectorShuffle %145 %144 3 4 2 
                                                      OpStore %92 %146 
                  read_only Texture2DSampled %149 = OpLoad %148 
                                       f32_3 %150 = OpLoad %92 
                                       f32_2 %151 = OpVectorShuffle %150 %150 0 1 
                                       f32_4 %152 = OpImageSampleImplicitLod %149 %151 
                                         f32 %153 = OpCompositeExtract %152 0 
                                                      OpStore %147 %153 
                                       f32_4 %154 = OpLoad %11 
                                       f32_2 %155 = OpVectorShuffle %154 %154 0 1 
                              Uniform f32_4* %157 = OpAccessChain %17 %156 
                                       f32_4 %158 = OpLoad %157 
                                       f32_2 %159 = OpVectorShuffle %158 %158 0 1 
                                       f32_2 %160 = OpFMul %155 %159 
                              Uniform f32_4* %161 = OpAccessChain %17 %156 
                                       f32_4 %162 = OpLoad %161 
                                       f32_2 %163 = OpVectorShuffle %162 %162 2 3 
                                       f32_2 %164 = OpFAdd %160 %163 
                                                      OpStore %32 %164 
                                       f32_2 %165 = OpLoad %111 
                                Uniform f32* %166 = OpAccessChain %17 %118 
                                         f32 %167 = OpLoad %166 
                                Uniform f32* %168 = OpAccessChain %17 %118 
                                         f32 %169 = OpLoad %168 
                                       f32_2 %170 = OpCompositeConstruct %167 %169 
                                         f32 %171 = OpCompositeExtract %170 0 
                                         f32 %172 = OpCompositeExtract %170 1 
                                       f32_2 %173 = OpCompositeConstruct %171 %172 
                                       f32_2 %174 = OpFMul %165 %173 
                                       f32_2 %175 = OpLoad %32 
                                       f32_2 %176 = OpFAdd %174 %175 
                                                      OpStore %32 %176 
                                         f32 %177 = OpLoad %147 
                                       f32_2 %178 = OpCompositeConstruct %177 %177 
                                Uniform f32* %180 = OpAccessChain %17 %179 
                                         f32 %181 = OpLoad %180 
                                Uniform f32* %182 = OpAccessChain %17 %179 
                                         f32 %183 = OpLoad %182 
                                       f32_2 %184 = OpCompositeConstruct %181 %183 
                                         f32 %185 = OpCompositeExtract %184 0 
                                         f32 %186 = OpCompositeExtract %184 1 
                                       f32_2 %187 = OpCompositeConstruct %185 %186 
                                       f32_2 %188 = OpFMul %178 %187 
                                       f32_2 %189 = OpLoad %32 
                                       f32_2 %190 = OpFAdd %188 %189 
                                                      OpStore %32 %190 
                  read_only Texture2DSampled %193 = OpLoad %192 
                                       f32_2 %194 = OpLoad %32 
                                       f32_4 %195 = OpImageSampleImplicitLod %193 %194 
                                         f32 %196 = OpCompositeExtract %195 0 
                                                      OpStore %191 %196 
                                         f32 %197 = OpLoad %191 
                                Private f32* %198 = OpAccessChain %9 %40 
                                         f32 %199 = OpLoad %198 
                                         f32 %200 = OpFMul %197 %199 
                                Private f32* %201 = OpAccessChain %9 %40 
                                                      OpStore %201 %200 
                                       f32_4 %203 = OpLoad %11 
                                       f32_2 %204 = OpVectorShuffle %203 %203 0 1 
                              Uniform f32_4* %206 = OpAccessChain %17 %205 
                                       f32_4 %207 = OpLoad %206 
                                       f32_2 %208 = OpVectorShuffle %207 %207 0 1 
                                       f32_2 %209 = OpFMul %204 %208 
                              Uniform f32_4* %210 = OpAccessChain %17 %205 
                                       f32_4 %211 = OpLoad %210 
                                       f32_2 %212 = OpVectorShuffle %211 %211 2 3 
                                       f32_2 %213 = OpFAdd %209 %212 
                                       f32_3 %214 = OpLoad %202 
                                       f32_3 %215 = OpVectorShuffle %214 %213 3 4 2 
                                                      OpStore %202 %215 
                                       f32_2 %216 = OpLoad %111 
                                Uniform f32* %217 = OpAccessChain %17 %118 
                                         f32 %218 = OpLoad %217 
                                Uniform f32* %219 = OpAccessChain %17 %118 
                                         f32 %220 = OpLoad %219 
                                       f32_2 %221 = OpCompositeConstruct %218 %220 
                                         f32 %222 = OpCompositeExtract %221 0 
                                         f32 %223 = OpCompositeExtract %221 1 
                                       f32_2 %224 = OpCompositeConstruct %222 %223 
                                       f32_2 %225 = OpFMul %216 %224 
                                       f32_3 %226 = OpLoad %202 
                                       f32_2 %227 = OpVectorShuffle %226 %226 0 1 
                                       f32_2 %228 = OpFAdd %225 %227 
                                       f32_3 %229 = OpLoad %202 
                                       f32_3 %230 = OpVectorShuffle %229 %228 3 4 2 
                                                      OpStore %202 %230 
                                         f32 %231 = OpLoad %147 
                                       f32_2 %232 = OpCompositeConstruct %231 %231 
                                Uniform f32* %233 = OpAccessChain %17 %179 
                                         f32 %234 = OpLoad %233 
                                Uniform f32* %235 = OpAccessChain %17 %179 
                                         f32 %236 = OpLoad %235 
                                       f32_2 %237 = OpCompositeConstruct %234 %236 
                                         f32 %238 = OpCompositeExtract %237 0 
                                         f32 %239 = OpCompositeExtract %237 1 
                                       f32_2 %240 = OpCompositeConstruct %238 %239 
                                       f32_2 %241 = OpFMul %232 %240 
                                       f32_3 %242 = OpLoad %202 
                                       f32_2 %243 = OpVectorShuffle %242 %242 0 1 
                                       f32_2 %244 = OpFAdd %241 %243 
                                       f32_3 %245 = OpLoad %92 
                                       f32_3 %246 = OpVectorShuffle %245 %244 3 1 4 
                                                      OpStore %92 %246 
                  read_only Texture2DSampled %248 = OpLoad %247 
                                       f32_3 %249 = OpLoad %92 
                                       f32_2 %250 = OpVectorShuffle %249 %249 0 2 
                                       f32_4 %251 = OpImageSampleImplicitLod %248 %250 
                                         f32 %252 = OpCompositeExtract %251 0 
                                                      OpStore %147 %252 
                                       f32_4 %253 = OpLoad %11 
                                       f32_2 %254 = OpVectorShuffle %253 %253 0 1 
                              Uniform f32_4* %256 = OpAccessChain %17 %255 
                                       f32_4 %257 = OpLoad %256 
                                       f32_2 %258 = OpVectorShuffle %257 %257 0 1 
                                       f32_2 %259 = OpFMul %254 %258 
                              Uniform f32_4* %260 = OpAccessChain %17 %255 
                                       f32_4 %261 = OpLoad %260 
                                       f32_2 %262 = OpVectorShuffle %261 %261 2 3 
                                       f32_2 %263 = OpFAdd %259 %262 
                                       f32_3 %264 = OpLoad %202 
                                       f32_3 %265 = OpVectorShuffle %264 %263 3 4 2 
                                                      OpStore %202 %265 
                                       f32_2 %266 = OpLoad %111 
                                Uniform f32* %267 = OpAccessChain %17 %118 
                                         f32 %268 = OpLoad %267 
                                Uniform f32* %269 = OpAccessChain %17 %118 
                                         f32 %270 = OpLoad %269 
                                       f32_2 %271 = OpCompositeConstruct %268 %270 
                                         f32 %272 = OpCompositeExtract %271 0 
                                         f32 %273 = OpCompositeExtract %271 1 
                                       f32_2 %274 = OpCompositeConstruct %272 %273 
                                       f32_2 %275 = OpFMul %266 %274 
                                       f32_3 %276 = OpLoad %202 
                                       f32_2 %277 = OpVectorShuffle %276 %276 0 1 
                                       f32_2 %278 = OpFAdd %275 %277 
                                       f32_3 %279 = OpLoad %202 
                                       f32_3 %280 = OpVectorShuffle %279 %278 3 4 2 
                                                      OpStore %202 %280 
                  read_only Texture2DSampled %283 = OpLoad %282 
                                       f32_3 %284 = OpLoad %202 
                                       f32_2 %285 = OpVectorShuffle %284 %284 0 1 
                                       f32_4 %286 = OpImageSampleImplicitLod %283 %285 
                                         f32 %287 = OpCompositeExtract %286 0 
                                                      OpStore %281 %287 
                                         f32 %288 = OpLoad %281 
                                Uniform f32* %290 = OpAccessChain %17 %289 
                                         f32 %291 = OpLoad %290 
                                         f32 %292 = OpFAdd %288 %291 
                                                      OpStore %43 %292 
                                         f32 %293 = OpLoad %43 
                                Uniform f32* %295 = OpAccessChain %17 %294 
                                         f32 %296 = OpLoad %295 
                                         f32 %297 = OpFMul %293 %296 
                                                      OpStore %43 %297 
                                         f32 %298 = OpLoad %43 
                                         f32 %301 = OpExtInst %1 43 %298 %299 %300 
                                                      OpStore %43 %301 
                                         f32 %302 = OpLoad %43 
                                         f32 %303 = OpFAdd %302 %37 
                                                      OpStore %43 %303 
                                         f32 %304 = OpLoad %147 
                                         f32 %305 = OpLoad %43 
                                         f32 %306 = OpFMul %304 %305 
                                         f32 %307 = OpFAdd %306 %300 
                                Private f32* %308 = OpAccessChain %92 %40 
                                                      OpStore %308 %307 
                                Private f32* %309 = OpAccessChain %92 %40 
                                         f32 %310 = OpLoad %309 
                                         f32 %311 = OpLoad %191 
                                         f32 %312 = OpFMul %310 %311 
                                Private f32* %313 = OpAccessChain %32 %40 
                                                      OpStore %313 %312 
                                Private f32* %314 = OpAccessChain %92 %40 
                                         f32 %315 = OpLoad %314 
                                         f32 %316 = OpFNegate %315 
                                         f32 %317 = OpFAdd %316 %300 
                                Private f32* %318 = OpAccessChain %92 %40 
                                                      OpStore %318 %317 
                                Private f32* %319 = OpAccessChain %92 %40 
                                         f32 %320 = OpLoad %319 
                                Private f32* %321 = OpAccessChain %32 %40 
                                         f32 %322 = OpLoad %321 
                                         f32 %323 = OpFMul %320 %322 
                                Private f32* %324 = OpAccessChain %92 %40 
                                                      OpStore %324 %323 
                                Private f32* %325 = OpAccessChain %92 %40 
                                         f32 %326 = OpLoad %325 
                                Uniform f32* %328 = OpAccessChain %17 %327 
                                         f32 %329 = OpLoad %328 
                                         f32 %330 = OpFMul %326 %329 
                                Private f32* %331 = OpAccessChain %92 %40 
                                                      OpStore %331 %330 
                                       f32_4 %332 = OpLoad %11 
                                       f32_2 %333 = OpVectorShuffle %332 %332 0 1 
                              Uniform f32_4* %335 = OpAccessChain %17 %334 
                                       f32_4 %336 = OpLoad %335 
                                       f32_2 %337 = OpVectorShuffle %336 %336 0 1 
                                       f32_2 %338 = OpFMul %333 %337 
                              Uniform f32_4* %339 = OpAccessChain %17 %334 
                                       f32_4 %340 = OpLoad %339 
                                       f32_2 %341 = OpVectorShuffle %340 %340 2 3 
                                       f32_2 %342 = OpFAdd %338 %341 
                                       f32_3 %343 = OpLoad %202 
                                       f32_3 %344 = OpVectorShuffle %343 %342 3 4 2 
                                                      OpStore %202 %344 
                                       f32_2 %345 = OpLoad %111 
                                Uniform f32* %346 = OpAccessChain %17 %118 
                                         f32 %347 = OpLoad %346 
                                Uniform f32* %348 = OpAccessChain %17 %118 
                                         f32 %349 = OpLoad %348 
                                       f32_2 %350 = OpCompositeConstruct %347 %349 
                                         f32 %351 = OpCompositeExtract %350 0 
                                         f32 %352 = OpCompositeExtract %350 1 
                                       f32_2 %353 = OpCompositeConstruct %351 %352 
                                       f32_2 %354 = OpFMul %345 %353 
                                       f32_3 %355 = OpLoad %202 
                                       f32_2 %356 = OpVectorShuffle %355 %355 0 1 
                                       f32_2 %357 = OpFAdd %354 %356 
                                                      OpStore %111 %357 
                              Uniform f32_4* %358 = OpAccessChain %17 %133 
                                       f32_4 %359 = OpLoad %358 
                                       f32_2 %360 = OpVectorShuffle %359 %359 1 1 
                                Uniform f32* %362 = OpAccessChain %17 %361 
                                         f32 %363 = OpLoad %362 
                                       f32_2 %364 = OpCompositeConstruct %363 %363 
                                       f32_2 %365 = OpFMul %360 %364 
                                       f32_2 %366 = OpLoad %111 
                                       f32_2 %367 = OpFAdd %365 %366 
                                                      OpStore %111 %367 
                  read_only Texture2DSampled %369 = OpLoad %368 
                                       f32_2 %370 = OpLoad %111 
                                       f32_4 %371 = OpImageSampleImplicitLod %369 %370 
                                         f32 %372 = OpCompositeExtract %371 0 
                                                      OpStore %281 %372 
                                         f32 %373 = OpLoad %281 
                                Uniform f32* %375 = OpAccessChain %17 %374 
                                         f32 %376 = OpLoad %375 
                                         f32 %377 = OpFAdd %373 %376 
                                                      OpStore %43 %377 
                                         f32 %378 = OpLoad %43 
                                       f32_3 %379 = OpCompositeConstruct %378 %378 %378 
                              Uniform f32_4* %381 = OpAccessChain %17 %380 
                                       f32_4 %382 = OpLoad %381 
                                       f32_3 %383 = OpVectorShuffle %382 %382 0 1 2 
                                       f32_3 %384 = OpFMul %379 %383 
                                                      OpStore %202 %384 
                                       f32_3 %385 = OpLoad %202 
                                Uniform f32* %387 = OpAccessChain %17 %386 
                                         f32 %388 = OpLoad %387 
                                Uniform f32* %389 = OpAccessChain %17 %386 
                                         f32 %390 = OpLoad %389 
                                Uniform f32* %391 = OpAccessChain %17 %386 
                                         f32 %392 = OpLoad %391 
                                       f32_3 %393 = OpCompositeConstruct %388 %390 %392 
                                         f32 %394 = OpCompositeExtract %393 0 
                                         f32 %395 = OpCompositeExtract %393 1 
                                         f32 %396 = OpCompositeExtract %393 2 
                                       f32_3 %397 = OpCompositeConstruct %394 %395 %396 
                                       f32_3 %398 = OpFMul %385 %397 
                                                      OpStore %202 %398 
                                       f32_3 %399 = OpLoad %202 
                                       f32_2 %400 = OpLoad %32 
                                       f32_3 %401 = OpVectorShuffle %400 %400 0 0 0 
                                       f32_3 %402 = OpFMul %399 %401 
                                       f32_4 %403 = OpLoad %9 
                                       f32_3 %404 = OpVectorShuffle %403 %403 0 0 0 
                                       f32_3 %405 = OpFAdd %402 %404 
                                                      OpStore %202 %405 
                              Uniform f32_4* %408 = OpAccessChain %17 %407 
                                       f32_4 %409 = OpLoad %408 
                                       f32_3 %410 = OpVectorShuffle %409 %409 0 1 2 
                                Uniform f32* %412 = OpAccessChain %17 %411 
                                         f32 %413 = OpLoad %412 
                                       f32_3 %414 = OpCompositeConstruct %413 %413 %413 
                                       f32_3 %415 = OpFMul %410 %414 
                                                      OpStore %406 %415 
                                       f32_3 %416 = OpLoad %406 
                                       f32_2 %417 = OpLoad %32 
                                       f32_3 %418 = OpVectorShuffle %417 %417 0 0 0 
                                       f32_3 %419 = OpFMul %416 %418 
                                       f32_3 %420 = OpLoad %202 
                                       f32_3 %421 = OpFAdd %419 %420 
                                                      OpStore %202 %421 
                                       f32_3 %422 = OpLoad %92 
                                       f32_3 %423 = OpVectorShuffle %422 %422 0 0 0 
                              Uniform f32_4* %425 = OpAccessChain %17 %424 
                                       f32_4 %426 = OpLoad %425 
                                       f32_3 %427 = OpVectorShuffle %426 %426 0 1 2 
                                       f32_3 %428 = OpFMul %423 %427 
                                       f32_3 %429 = OpLoad %202 
                                       f32_3 %430 = OpFAdd %428 %429 
                                       f32_4 %431 = OpLoad %9 
                                       f32_4 %432 = OpVectorShuffle %431 %430 4 5 2 6 
                                                      OpStore %9 %432 
                                Uniform f32* %434 = OpAccessChain %17 %433 
                                         f32 %435 = OpLoad %434 
                                         f32 %436 = OpFAdd %435 %37 
                                Private f32* %437 = OpAccessChain %111 %40 
                                                      OpStore %437 %436 
                                       f32_3 %438 = OpLoad %54 
                                       f32_2 %439 = OpVectorShuffle %438 %438 0 1 
                                       f32_2 %440 = OpLoad %111 
                                       f32_2 %441 = OpVectorShuffle %440 %440 0 0 
                                       f32_2 %442 = OpFMul %439 %441 
                                       f32_3 %443 = OpLoad %54 
                                       f32_3 %444 = OpVectorShuffle %443 %442 3 4 2 
                                                      OpStore %54 %444 
                                       f32_4 %445 = OpLoad %11 
                                       f32_2 %446 = OpVectorShuffle %445 %445 0 1 
                              Uniform f32_4* %448 = OpAccessChain %17 %447 
                                       f32_4 %449 = OpLoad %448 
                                       f32_2 %450 = OpVectorShuffle %449 %449 0 1 
                                       f32_2 %451 = OpFMul %446 %450 
                              Uniform f32_4* %452 = OpAccessChain %17 %447 
                                       f32_4 %453 = OpLoad %452 
                                       f32_2 %454 = OpVectorShuffle %453 %453 2 3 
                                       f32_2 %455 = OpFAdd %451 %454 
                                                      OpStore %111 %455 
                                       f32_3 %456 = OpLoad %54 
                                       f32_2 %457 = OpVectorShuffle %456 %456 0 1 
                                       f32_2 %458 = OpFMul %457 %69 
                                       f32_2 %459 = OpLoad %111 
                                       f32_2 %460 = OpFAdd %458 %459 
                                       f32_3 %461 = OpLoad %54 
                                       f32_3 %462 = OpVectorShuffle %461 %460 3 4 2 
                                                      OpStore %54 %462 
                  read_only Texture2DSampled %465 = OpLoad %464 
                                       f32_3 %466 = OpLoad %54 
                                       f32_2 %467 = OpVectorShuffle %466 %466 0 1 
                                       f32_4 %468 = OpImageSampleImplicitLod %465 %467 
                                         f32 %469 = OpCompositeExtract %468 0 
                                                      OpStore %463 %469 
                                         f32 %470 = OpLoad %463 
                                Uniform f32* %472 = OpAccessChain %17 %471 
                                         f32 %473 = OpLoad %472 
                                         f32 %474 = OpFMul %470 %473 
                                Private f32* %475 = OpAccessChain %54 %40 
                                                      OpStore %475 %474 
                                       f32_4 %476 = OpLoad %11 
                                       f32_2 %477 = OpVectorShuffle %476 %476 0 1 
                              Uniform f32_4* %479 = OpAccessChain %17 %478 
                                       f32_4 %480 = OpLoad %479 
                                       f32_2 %481 = OpVectorShuffle %480 %480 0 1 
                                       f32_2 %482 = OpFMul %477 %481 
                              Uniform f32_4* %483 = OpAccessChain %17 %478 
                                       f32_4 %484 = OpLoad %483 
                                       f32_2 %485 = OpVectorShuffle %484 %484 2 3 
                                       f32_2 %486 = OpFAdd %482 %485 
                                       f32_3 %487 = OpLoad %202 
                                       f32_3 %488 = OpVectorShuffle %487 %486 0 3 4 
                                                      OpStore %202 %488 
                                Uniform f32* %490 = OpAccessChain %17 %133 %489 
                                         f32 %491 = OpLoad %490 
                                Uniform f32* %493 = OpAccessChain %17 %492 
                                         f32 %494 = OpLoad %493 
                                         f32 %495 = OpFMul %491 %494 
                                Private f32* %496 = OpAccessChain %202 %489 
                                         f32 %497 = OpLoad %496 
                                         f32 %498 = OpFAdd %495 %497 
                                Private f32* %499 = OpAccessChain %202 %40 
                                                      OpStore %499 %498 
                  read_only Texture2DSampled %502 = OpLoad %501 
                                       f32_3 %503 = OpLoad %202 
                                       f32_2 %504 = OpVectorShuffle %503 %503 0 2 
                                       f32_4 %505 = OpImageSampleImplicitLod %502 %504 
                                       f32_3 %506 = OpVectorShuffle %505 %505 0 1 2 
                                                      OpStore %500 %506 
                                       f32_3 %507 = OpLoad %500 
                                       f32_3 %508 = OpLoad %54 
                                       f32_3 %509 = OpVectorShuffle %508 %508 0 0 0 
                                       f32_3 %510 = OpFMul %507 %509 
                                                      OpStore %54 %510 
                                       f32_3 %511 = OpLoad %54 
                                       f32_2 %512 = OpLoad %32 
                                       f32_3 %513 = OpVectorShuffle %512 %512 0 0 0 
                                       f32_3 %514 = OpFMul %511 %513 
                                       f32_4 %515 = OpLoad %9 
                                       f32_3 %516 = OpVectorShuffle %515 %515 0 1 3 
                                       f32_3 %517 = OpFAdd %514 %516 
                                       f32_4 %518 = OpLoad %9 
                                       f32_4 %519 = OpVectorShuffle %518 %517 4 5 6 3 
                                                      OpStore %9 %519 
                                       f32_4 %520 = OpLoad %9 
                                       f32_3 %521 = OpVectorShuffle %520 %520 0 1 2 
                                       f32_3 %522 = OpCompositeConstruct %299 %299 %299 
                                       f32_3 %523 = OpCompositeConstruct %300 %300 %300 
                                       f32_3 %524 = OpExtInst %1 43 %521 %522 %523 
                                       f32_4 %525 = OpLoad %9 
                                       f32_4 %526 = OpVectorShuffle %525 %524 4 5 6 3 
                                                      OpStore %9 %526 
                                       f32_4 %527 = OpLoad %9 
                                       f32_3 %528 = OpVectorShuffle %527 %527 0 1 2 
                                Uniform f32* %530 = OpAccessChain %17 %529 
                                         f32 %531 = OpLoad %530 
                                Uniform f32* %532 = OpAccessChain %17 %529 
                                         f32 %533 = OpLoad %532 
                                Uniform f32* %534 = OpAccessChain %17 %529 
                                         f32 %535 = OpLoad %534 
                                       f32_3 %536 = OpCompositeConstruct %531 %533 %535 
                                         f32 %537 = OpCompositeExtract %536 0 
                                         f32 %538 = OpCompositeExtract %536 1 
                                         f32 %539 = OpCompositeExtract %536 2 
                                       f32_3 %540 = OpCompositeConstruct %537 %538 %539 
                                       f32_3 %541 = OpFMul %528 %540 
                                       f32_4 %542 = OpLoad %9 
                                       f32_4 %543 = OpVectorShuffle %542 %541 4 5 6 3 
                                                      OpStore %9 %543 
                                  Input f32* %545 = OpAccessChain %11 %489 
                                         f32 %546 = OpLoad %545 
                                Uniform f32* %548 = OpAccessChain %17 %547 
                                         f32 %549 = OpLoad %548 
                                         f32 %550 = OpFMul %546 %549 
                                Uniform f32* %552 = OpAccessChain %17 %551 
                                         f32 %553 = OpLoad %552 
                                         f32 %554 = OpFAdd %550 %553 
                                Private f32* %555 = OpAccessChain %54 %40 
                                                      OpStore %555 %554 
                                Private f32* %556 = OpAccessChain %9 %40 
                                         f32 %557 = OpLoad %556 
                                Private f32* %558 = OpAccessChain %54 %40 
                                         f32 %559 = OpLoad %558 
                                         f32 %560 = OpFMul %557 %559 
                                Private f32* %562 = OpAccessChain %9 %561 
                                                      OpStore %562 %560 
                                Private f32* %563 = OpAccessChain %9 %561 
                                         f32 %564 = OpLoad %563 
                                         f32 %565 = OpExtInst %1 43 %564 %299 %300 
                                Private f32* %566 = OpAccessChain %9 %561 
                                                      OpStore %566 %565 
                                       f32_4 %569 = OpLoad %9 
                                                      OpStore %568 %569 
                                                      OpReturn
                                                      OpFunctionEnd
"
}
SubProgram "d3d11 " {
Keywords { "FOG_HEIGHT" "INSTANCING_ON" }
"// shader disassembly not supported on DXBC"
}
SubProgram "vulkan " {
Keywords { "FOG_HEIGHT" "INSTANCING_ON" }
"; SPIR-V
; Version: 1.0
; Generator: Khronos Glslang Reference Front End; 1
; Bound: 351
; Schema: 0
                                                      OpCapability Shader 
                                               %1 = OpExtInstImport "GLSL.std.450" 
                                                      OpMemoryModel Logical GLSL450 
                                                      OpEntryPoint Vertex %4 "main" %10 %19 %97 %119 %120 %122 %123 %125 %126 %128 %129 %131 %135 %140 %181 %335 
                                                      OpDecorate %10 BuiltIn ViewportIndex 
                                                      OpDecorate %19 Location 19 
                                                      OpDecorate %24 ArrayStride 24 
                                                      OpDecorate %25 ArrayStride 25 
                                                      OpMemberDecorate %26 0 Offset 26 
                                                      OpMemberDecorate %26 1 Offset 26 
                                                      OpDecorate %28 ArrayStride 28 
                                                      OpMemberDecorate %29 0 Offset 29 
                                                      OpDecorate %29 Block 
                                                      OpDecorate %31 DescriptorSet 31 
                                                      OpDecorate %31 Binding 31 
                                                      OpDecorate %65 ArrayStride 65 
                                                      OpMemberDecorate %66 0 Offset 66 
                                                      OpMemberDecorate %66 1 Offset 66 
                                                      OpMemberDecorate %66 2 Offset 66 
                                                      OpMemberDecorate %66 3 RelaxedPrecision 
                                                      OpMemberDecorate %66 3 Offset 66 
                                                      OpDecorate %66 Block 
                                                      OpDecorate %68 DescriptorSet 68 
                                                      OpDecorate %68 Binding 68 
                                                      OpMemberDecorate %95 0 BuiltIn 95 
                                                      OpMemberDecorate %95 1 BuiltIn 95 
                                                      OpMemberDecorate %95 2 BuiltIn 95 
                                                      OpDecorate %95 Block 
                                                      OpDecorate %100 RelaxedPrecision 
                                                      OpDecorate %101 RelaxedPrecision 
                                                      OpDecorate %119 Location 119 
                                                      OpDecorate %120 Location 120 
                                                      OpDecorate %122 Location 122 
                                                      OpDecorate %123 Location 123 
                                                      OpDecorate %125 Location 125 
                                                      OpDecorate %126 Location 126 
                                                      OpDecorate %128 Location 128 
                                                      OpDecorate %129 Location 129 
                                                      OpDecorate %131 Location 131 
                                                      OpDecorate %135 Flat 
                                                      OpDecorate %135 Location 135 
                                                      OpDecorate %140 Location 140 
                                                      OpDecorate %181 Location 181 
                                                      OpDecorate %335 Location 335 
                                               %2 = OpTypeVoid 
                                               %3 = OpTypeFunction %2 
                                               %6 = OpTypeInt 32 1 
                                               %7 = OpTypePointer Private %6 
                                  Private i32* %8 = OpVariable Private 
                                               %9 = OpTypePointer Input %6 
                                   Input i32* %10 = OpVariable Input 
                                          i32 %12 = OpConstant 3 
                                              %14 = OpTypeFloat 32 
                                              %15 = OpTypeVector %14 4 
                                              %16 = OpTypePointer Private %15 
                               Private f32_4* %17 = OpVariable Private 
                                              %18 = OpTypePointer Input %15 
                                 Input f32_4* %19 = OpVariable Input 
                                              %22 = OpTypeInt 32 0 
                                          u32 %23 = OpConstant 4 
                                              %24 = OpTypeArray %15 %23 
                                              %25 = OpTypeArray %15 %23 
                                              %26 = OpTypeStruct %24 %25 
                                          u32 %27 = OpConstant 500 
                                              %28 = OpTypeArray %26 %27 
                                              %29 = OpTypeStruct %28 
                                              %30 = OpTypePointer Uniform %29 
Uniform struct {struct {f32_4[4]; f32_4[4];}[500];}* %31 = OpVariable Uniform 
                                          i32 %32 = OpConstant 0 
                                          i32 %34 = OpConstant 1 
                                              %35 = OpTypePointer Uniform %15 
                                          i32 %48 = OpConstant 2 
                               Private f32_4* %61 = OpVariable Private 
                                              %64 = OpTypeVector %14 3 
                                              %65 = OpTypeArray %15 %23 
                                              %66 = OpTypeStruct %64 %15 %65 %14 
                                              %67 = OpTypePointer Uniform %66 
Uniform struct {f32_3; f32_4; f32_4[4]; f32;}* %68 = OpVariable Uniform 
                                          u32 %93 = OpConstant 1 
                                              %94 = OpTypeArray %14 %93 
                                              %95 = OpTypeStruct %15 %14 %94 
                                              %96 = OpTypePointer Output %95 
         Output struct {f32_4; f32; f32[1];}* %97 = OpVariable Output 
                                              %98 = OpTypePointer Uniform %14 
                                         u32 %102 = OpConstant 3 
                                             %103 = OpTypePointer Private %14 
                                         u32 %107 = OpConstant 2 
                                             %111 = OpTypePointer Output %14 
                                             %115 = OpTypePointer Output %15 
                               Output f32_4* %119 = OpVariable Output 
                                Input f32_4* %120 = OpVariable Input 
                               Output f32_4* %122 = OpVariable Output 
                                Input f32_4* %123 = OpVariable Input 
                               Output f32_4* %125 = OpVariable Output 
                                Input f32_4* %126 = OpVariable Input 
                               Output f32_4* %128 = OpVariable Output 
                                Input f32_4* %129 = OpVariable Input 
                               Output f32_4* %131 = OpVariable Output 
                                         f32 %132 = OpConstant 3.674022E-40 
                                       f32_4 %133 = OpConstantComposite %132 %132 %132 %132 
                                             %134 = OpTypePointer Output %22 
                                 Output u32* %135 = OpVariable Output 
                                             %138 = OpTypePointer Private %64 
                              Private f32_3* %139 = OpVariable Private 
                                Input f32_4* %140 = OpVariable Input 
                                         u32 %169 = OpConstant 0 
                                             %180 = OpTypePointer Input %64 
                                Input f32_3* %181 = OpVariable Input 
                                Private f32* %203 = OpVariable Private 
                                             %236 = OpTypePointer Input %14 
                              Private f32_3* %249 = OpVariable Private 
                              Private f32_3* %253 = OpVariable Private 
                                             %290 = OpTypePointer Uniform %64 
                                Private f32* %294 = OpVariable Private 
                               Output f32_4* %335 = OpVariable Output 
                                          void %4 = OpFunction None %3 
                                               %5 = OpLabel 
                                          i32 %11 = OpLoad %10 
                                          i32 %13 = OpShiftLeftLogical %11 %12 
                                                      OpStore %8 %13 
                                        f32_4 %20 = OpLoad %19 
                                        f32_4 %21 = OpVectorShuffle %20 %20 1 1 1 1 
                                          i32 %33 = OpLoad %10 
                               Uniform f32_4* %36 = OpAccessChain %31 %32 %33 %32 %34 
                                        f32_4 %37 = OpLoad %36 
                                        f32_4 %38 = OpFMul %21 %37 
                                                      OpStore %17 %38 
                                          i32 %39 = OpLoad %10 
                               Uniform f32_4* %40 = OpAccessChain %31 %32 %39 %32 %32 
                                        f32_4 %41 = OpLoad %40 
                                        f32_4 %42 = OpLoad %19 
                                        f32_4 %43 = OpVectorShuffle %42 %42 0 0 0 0 
                                        f32_4 %44 = OpFMul %41 %43 
                                        f32_4 %45 = OpLoad %17 
                                        f32_4 %46 = OpFAdd %44 %45 
                                                      OpStore %17 %46 
                                          i32 %47 = OpLoad %10 
                               Uniform f32_4* %49 = OpAccessChain %31 %32 %47 %32 %48 
                                        f32_4 %50 = OpLoad %49 
                                        f32_4 %51 = OpLoad %19 
                                        f32_4 %52 = OpVectorShuffle %51 %51 2 2 2 2 
                                        f32_4 %53 = OpFMul %50 %52 
                                        f32_4 %54 = OpLoad %17 
                                        f32_4 %55 = OpFAdd %53 %54 
                                                      OpStore %17 %55 
                                        f32_4 %56 = OpLoad %17 
                                          i32 %57 = OpLoad %10 
                               Uniform f32_4* %58 = OpAccessChain %31 %32 %57 %32 %12 
                                        f32_4 %59 = OpLoad %58 
                                        f32_4 %60 = OpFAdd %56 %59 
                                                      OpStore %17 %60 
                                        f32_4 %62 = OpLoad %17 
                                        f32_4 %63 = OpVectorShuffle %62 %62 1 1 1 1 
                               Uniform f32_4* %69 = OpAccessChain %68 %48 %34 
                                        f32_4 %70 = OpLoad %69 
                                        f32_4 %71 = OpFMul %63 %70 
                                                      OpStore %61 %71 
                               Uniform f32_4* %72 = OpAccessChain %68 %48 %32 
                                        f32_4 %73 = OpLoad %72 
                                        f32_4 %74 = OpLoad %17 
                                        f32_4 %75 = OpVectorShuffle %74 %74 0 0 0 0 
                                        f32_4 %76 = OpFMul %73 %75 
                                        f32_4 %77 = OpLoad %61 
                                        f32_4 %78 = OpFAdd %76 %77 
                                                      OpStore %61 %78 
                               Uniform f32_4* %79 = OpAccessChain %68 %48 %48 
                                        f32_4 %80 = OpLoad %79 
                                        f32_4 %81 = OpLoad %17 
                                        f32_4 %82 = OpVectorShuffle %81 %81 2 2 2 2 
                                        f32_4 %83 = OpFMul %80 %82 
                                        f32_4 %84 = OpLoad %61 
                                        f32_4 %85 = OpFAdd %83 %84 
                                                      OpStore %61 %85 
                               Uniform f32_4* %86 = OpAccessChain %68 %48 %12 
                                        f32_4 %87 = OpLoad %86 
                                        f32_4 %88 = OpLoad %17 
                                        f32_4 %89 = OpVectorShuffle %88 %88 3 3 3 3 
                                        f32_4 %90 = OpFMul %87 %89 
                                        f32_4 %91 = OpLoad %61 
                                        f32_4 %92 = OpFAdd %90 %91 
                                                      OpStore %17 %92 
                                 Uniform f32* %99 = OpAccessChain %68 %12 
                                         f32 %100 = OpLoad %99 
                                         f32 %101 = OpFNegate %100 
                                Private f32* %104 = OpAccessChain %17 %102 
                                         f32 %105 = OpLoad %104 
                                         f32 %106 = OpFMul %101 %105 
                                Private f32* %108 = OpAccessChain %17 %107 
                                         f32 %109 = OpLoad %108 
                                         f32 %110 = OpFAdd %106 %109 
                                 Output f32* %112 = OpAccessChain %97 %32 %107 
                                                      OpStore %112 %110 
                                       f32_4 %113 = OpLoad %17 
                                       f32_3 %114 = OpVectorShuffle %113 %113 0 1 3 
                               Output f32_4* %116 = OpAccessChain %97 %32 
                                       f32_4 %117 = OpLoad %116 
                                       f32_4 %118 = OpVectorShuffle %117 %114 4 5 2 6 
                                                      OpStore %116 %118 
                                       f32_4 %121 = OpLoad %120 
                                                      OpStore %119 %121 
                                       f32_4 %124 = OpLoad %123 
                                                      OpStore %122 %124 
                                       f32_4 %127 = OpLoad %126 
                                                      OpStore %125 %127 
                                       f32_4 %130 = OpLoad %129 
                                                      OpStore %128 %130 
                                                      OpStore %131 %133 
                                         i32 %136 = OpLoad %10 
                                         u32 %137 = OpBitcast %136 
                                                      OpStore %135 %137 
                                       f32_4 %141 = OpLoad %140 
                                       f32_3 %142 = OpVectorShuffle %141 %141 1 1 1 
                                         i32 %143 = OpLoad %10 
                              Uniform f32_4* %144 = OpAccessChain %31 %32 %143 %32 %34 
                                       f32_4 %145 = OpLoad %144 
                                       f32_3 %146 = OpVectorShuffle %145 %145 1 2 0 
                                       f32_3 %147 = OpFMul %142 %146 
                                                      OpStore %139 %147 
                                         i32 %148 = OpLoad %10 
                              Uniform f32_4* %149 = OpAccessChain %31 %32 %148 %32 %32 
                                       f32_4 %150 = OpLoad %149 
                                       f32_3 %151 = OpVectorShuffle %150 %150 1 2 0 
                                       f32_4 %152 = OpLoad %140 
                                       f32_3 %153 = OpVectorShuffle %152 %152 0 0 0 
                                       f32_3 %154 = OpFMul %151 %153 
                                       f32_3 %155 = OpLoad %139 
                                       f32_3 %156 = OpFAdd %154 %155 
                                                      OpStore %139 %156 
                                         i32 %157 = OpLoad %10 
                              Uniform f32_4* %158 = OpAccessChain %31 %32 %157 %32 %48 
                                       f32_4 %159 = OpLoad %158 
                                       f32_3 %160 = OpVectorShuffle %159 %159 1 2 0 
                                       f32_4 %161 = OpLoad %140 
                                       f32_3 %162 = OpVectorShuffle %161 %161 2 2 2 
                                       f32_3 %163 = OpFMul %160 %162 
                                       f32_3 %164 = OpLoad %139 
                                       f32_3 %165 = OpFAdd %163 %164 
                                                      OpStore %139 %165 
                                       f32_3 %166 = OpLoad %139 
                                       f32_3 %167 = OpLoad %139 
                                         f32 %168 = OpDot %166 %167 
                                Private f32* %170 = OpAccessChain %17 %169 
                                                      OpStore %170 %168 
                                Private f32* %171 = OpAccessChain %17 %169 
                                         f32 %172 = OpLoad %171 
                                         f32 %173 = OpExtInst %1 32 %172 
                                Private f32* %174 = OpAccessChain %17 %169 
                                                      OpStore %174 %173 
                                       f32_3 %175 = OpLoad %139 
                                       f32_3 %176 = OpVectorShuffle %175 %175 1 0 2 
                                       f32_4 %177 = OpLoad %17 
                                       f32_3 %178 = OpVectorShuffle %177 %177 0 0 0 
                                       f32_3 %179 = OpFMul %176 %178 
                                                      OpStore %139 %179 
                                       f32_3 %182 = OpLoad %181 
                                         i32 %183 = OpLoad %10 
                              Uniform f32_4* %184 = OpAccessChain %31 %32 %183 %34 %32 
                                       f32_4 %185 = OpLoad %184 
                                       f32_3 %186 = OpVectorShuffle %185 %185 0 1 2 
                                         f32 %187 = OpDot %182 %186 
                                Private f32* %188 = OpAccessChain %17 %93 
                                                      OpStore %188 %187 
                                       f32_3 %189 = OpLoad %181 
                                         i32 %190 = OpLoad %10 
                              Uniform f32_4* %191 = OpAccessChain %31 %32 %190 %34 %34 
                                       f32_4 %192 = OpLoad %191 
                                       f32_3 %193 = OpVectorShuffle %192 %192 0 1 2 
                                         f32 %194 = OpDot %189 %193 
                                Private f32* %195 = OpAccessChain %17 %107 
                                                      OpStore %195 %194 
                                       f32_3 %196 = OpLoad %181 
                                         i32 %197 = OpLoad %10 
                              Uniform f32_4* %198 = OpAccessChain %31 %32 %197 %34 %48 
                                       f32_4 %199 = OpLoad %198 
                                       f32_3 %200 = OpVectorShuffle %199 %199 0 1 2 
                                         f32 %201 = OpDot %196 %200 
                                Private f32* %202 = OpAccessChain %17 %169 
                                                      OpStore %202 %201 
                                       f32_4 %204 = OpLoad %17 
                                       f32_3 %205 = OpVectorShuffle %204 %204 0 1 2 
                                       f32_4 %206 = OpLoad %17 
                                       f32_3 %207 = OpVectorShuffle %206 %206 0 1 2 
                                         f32 %208 = OpDot %205 %207 
                                                      OpStore %203 %208 
                                         f32 %209 = OpLoad %203 
                                         f32 %210 = OpExtInst %1 32 %209 
                                                      OpStore %203 %210 
                                         f32 %211 = OpLoad %203 
                                       f32_3 %212 = OpCompositeConstruct %211 %211 %211 
                                       f32_4 %213 = OpLoad %17 
                                       f32_3 %214 = OpVectorShuffle %213 %213 0 1 2 
                                       f32_3 %215 = OpFMul %212 %214 
                                       f32_4 %216 = OpLoad %17 
                                       f32_4 %217 = OpVectorShuffle %216 %215 4 5 6 3 
                                                      OpStore %17 %217 
                                       f32_3 %218 = OpLoad %139 
                                       f32_3 %219 = OpVectorShuffle %218 %218 1 0 2 
                                       f32_4 %220 = OpLoad %17 
                                       f32_3 %221 = OpVectorShuffle %220 %220 0 1 2 
                                       f32_3 %222 = OpFMul %219 %221 
                                       f32_4 %223 = OpLoad %61 
                                       f32_4 %224 = OpVectorShuffle %223 %222 4 5 6 3 
                                                      OpStore %61 %224 
                                       f32_4 %225 = OpLoad %17 
                                       f32_3 %226 = OpVectorShuffle %225 %225 2 0 1 
                                       f32_3 %227 = OpLoad %139 
                                       f32_3 %228 = OpVectorShuffle %227 %227 0 2 1 
                                       f32_3 %229 = OpFMul %226 %228 
                                       f32_4 %230 = OpLoad %61 
                                       f32_3 %231 = OpVectorShuffle %230 %230 0 1 2 
                                       f32_3 %232 = OpFNegate %231 
                                       f32_3 %233 = OpFAdd %229 %232 
                                       f32_4 %234 = OpLoad %61 
                                       f32_4 %235 = OpVectorShuffle %234 %233 4 5 6 3 
                                                      OpStore %61 %235 
                                  Input f32* %237 = OpAccessChain %140 %102 
                                         f32 %238 = OpLoad %237 
                                Uniform f32* %239 = OpAccessChain %68 %34 %102 
                                         f32 %240 = OpLoad %239 
                                         f32 %241 = OpFMul %238 %240 
                                                      OpStore %203 %241 
                                         f32 %242 = OpLoad %203 
                                       f32_3 %243 = OpCompositeConstruct %242 %242 %242 
                                       f32_4 %244 = OpLoad %61 
                                       f32_3 %245 = OpVectorShuffle %244 %244 1 0 2 
                                       f32_3 %246 = OpFMul %243 %245 
                                       f32_4 %247 = OpLoad %61 
                                       f32_4 %248 = OpVectorShuffle %247 %246 4 5 6 3 
                                                      OpStore %61 %248 
                                Private f32* %250 = OpAccessChain %61 %169 
                                         f32 %251 = OpLoad %250 
                                Private f32* %252 = OpAccessChain %249 %93 
                                                      OpStore %252 %251 
                                       f32_4 %254 = OpLoad %19 
                                       f32_3 %255 = OpVectorShuffle %254 %254 1 1 1 
                                         i32 %256 = OpLoad %10 
                              Uniform f32_4* %257 = OpAccessChain %31 %32 %256 %32 %34 
                                       f32_4 %258 = OpLoad %257 
                                       f32_3 %259 = OpVectorShuffle %258 %258 0 1 2 
                                       f32_3 %260 = OpFMul %255 %259 
                                                      OpStore %253 %260 
                                         i32 %261 = OpLoad %10 
                              Uniform f32_4* %262 = OpAccessChain %31 %32 %261 %32 %32 
                                       f32_4 %263 = OpLoad %262 
                                       f32_3 %264 = OpVectorShuffle %263 %263 0 1 2 
                                       f32_4 %265 = OpLoad %19 
                                       f32_3 %266 = OpVectorShuffle %265 %265 0 0 0 
                                       f32_3 %267 = OpFMul %264 %266 
                                       f32_3 %268 = OpLoad %253 
                                       f32_3 %269 = OpFAdd %267 %268 
                                                      OpStore %253 %269 
                                         i32 %270 = OpLoad %10 
                              Uniform f32_4* %271 = OpAccessChain %31 %32 %270 %32 %48 
                                       f32_4 %272 = OpLoad %271 
                                       f32_3 %273 = OpVectorShuffle %272 %272 0 1 2 
                                       f32_4 %274 = OpLoad %19 
                                       f32_3 %275 = OpVectorShuffle %274 %274 2 2 2 
                                       f32_3 %276 = OpFMul %273 %275 
                                       f32_3 %277 = OpLoad %253 
                                       f32_3 %278 = OpFAdd %276 %277 
                                                      OpStore %253 %278 
                                         i32 %279 = OpLoad %10 
                              Uniform f32_4* %280 = OpAccessChain %31 %32 %279 %32 %12 
                                       f32_4 %281 = OpLoad %280 
                                       f32_3 %282 = OpVectorShuffle %281 %281 0 1 2 
                                       f32_4 %283 = OpLoad %19 
                                       f32_3 %284 = OpVectorShuffle %283 %283 3 3 3 
                                       f32_3 %285 = OpFMul %282 %284 
                                       f32_3 %286 = OpLoad %253 
                                       f32_3 %287 = OpFAdd %285 %286 
                                                      OpStore %253 %287 
                                       f32_3 %288 = OpLoad %253 
                                       f32_3 %289 = OpFNegate %288 
                              Uniform f32_3* %291 = OpAccessChain %68 %32 
                                       f32_3 %292 = OpLoad %291 
                                       f32_3 %293 = OpFAdd %289 %292 
                                                      OpStore %253 %293 
                                       f32_3 %295 = OpLoad %253 
                                       f32_3 %296 = OpLoad %253 
                                         f32 %297 = OpDot %295 %296 
                                                      OpStore %294 %297 
                                         f32 %298 = OpLoad %294 
                                         f32 %299 = OpExtInst %1 32 %298 
                                                      OpStore %294 %299 
                                         f32 %300 = OpLoad %294 
                                       f32_3 %301 = OpCompositeConstruct %300 %300 %300 
                                       f32_3 %302 = OpLoad %253 
                                       f32_3 %303 = OpFMul %301 %302 
                                                      OpStore %253 %303 
                                Private f32* %304 = OpAccessChain %139 %93 
                                         f32 %305 = OpLoad %304 
                                Private f32* %306 = OpAccessChain %249 %169 
                                                      OpStore %306 %305 
                                Private f32* %307 = OpAccessChain %17 %107 
                                         f32 %308 = OpLoad %307 
                                Private f32* %309 = OpAccessChain %249 %107 
                                                      OpStore %309 %308 
                                       f32_3 %310 = OpLoad %249 
                                       f32_3 %311 = OpLoad %253 
                                       f32_3 %312 = OpVectorShuffle %311 %311 1 1 1 
                                       f32_3 %313 = OpFMul %310 %312 
                                                      OpStore %249 %313 
                                Private f32* %314 = OpAccessChain %61 %107 
                                         f32 %315 = OpLoad %314 
                                Private f32* %316 = OpAccessChain %139 %93 
                                                      OpStore %316 %315 
                                Private f32* %317 = OpAccessChain %139 %107 
                                         f32 %318 = OpLoad %317 
                                Private f32* %319 = OpAccessChain %61 %169 
                                                      OpStore %319 %318 
                                Private f32* %320 = OpAccessChain %17 %93 
                                         f32 %321 = OpLoad %320 
                                Private f32* %322 = OpAccessChain %61 %107 
                                                      OpStore %322 %321 
                                Private f32* %323 = OpAccessChain %17 %169 
                                         f32 %324 = OpLoad %323 
                                Private f32* %325 = OpAccessChain %139 %107 
                                                      OpStore %325 %324 
                                       f32_4 %326 = OpLoad %61 
                                       f32_3 %327 = OpVectorShuffle %326 %326 0 1 2 
                                       f32_3 %328 = OpLoad %253 
                                       f32_3 %329 = OpVectorShuffle %328 %328 0 0 0 
                                       f32_3 %330 = OpFMul %327 %329 
                                       f32_3 %331 = OpLoad %249 
                                       f32_3 %332 = OpFAdd %330 %331 
                                       f32_4 %333 = OpLoad %17 
                                       f32_4 %334 = OpVectorShuffle %333 %332 4 5 6 3 
                                                      OpStore %17 %334 
                                       f32_3 %336 = OpLoad %139 
                                       f32_3 %337 = OpLoad %253 
                                       f32_3 %338 = OpVectorShuffle %337 %337 2 2 2 
                                       f32_3 %339 = OpFMul %336 %338 
                                       f32_4 %340 = OpLoad %17 
                                       f32_3 %341 = OpVectorShuffle %340 %340 0 1 2 
                                       f32_3 %342 = OpFAdd %339 %341 
                                       f32_4 %343 = OpLoad %335 
                                       f32_4 %344 = OpVectorShuffle %343 %342 4 5 6 3 
                                                      OpStore %335 %344 
                                 Output f32* %345 = OpAccessChain %335 %102 
                                                      OpStore %345 %132 
                                 Output f32* %346 = OpAccessChain %97 %32 %93 
                                         f32 %347 = OpLoad %346 
                                         f32 %348 = OpFNegate %347 
                                 Output f32* %349 = OpAccessChain %97 %32 %93 
                                                      OpStore %349 %348 
                                                      OpReturn
                                                      OpFunctionEnd
; SPIR-V
; Version: 1.0
; Generator: Khronos Glslang Reference Front End; 1
; Bound: 571
; Schema: 0
                                                      OpCapability Shader 
                                               %1 = OpExtInstImport "GLSL.std.450" 
                                                      OpMemoryModel Logical GLSL450 
                                                      OpEntryPoint Fragment %4 "main" %11 %44 %568 
                                                      OpExecutionMode %4 OriginUpperLeft 
                                                      OpDecorate %11 Location 11 
                                                      OpMemberDecorate %15 0 Offset 15 
                                                      OpMemberDecorate %15 1 Offset 15 
                                                      OpMemberDecorate %15 2 Offset 15 
                                                      OpMemberDecorate %15 3 RelaxedPrecision 
                                                      OpMemberDecorate %15 3 Offset 15 
                                                      OpMemberDecorate %15 4 RelaxedPrecision 
                                                      OpMemberDecorate %15 4 Offset 15 
                                                      OpMemberDecorate %15 5 Offset 15 
                                                      OpMemberDecorate %15 6 Offset 15 
                                                      OpMemberDecorate %15 7 Offset 15 
                                                      OpMemberDecorate %15 8 Offset 15 
                                                      OpMemberDecorate %15 9 Offset 15 
                                                      OpMemberDecorate %15 10 Offset 15 
                                                      OpMemberDecorate %15 11 Offset 15 
                                                      OpMemberDecorate %15 12 Offset 15 
                                                      OpMemberDecorate %15 13 Offset 15 
                                                      OpMemberDecorate %15 14 Offset 15 
                                                      OpMemberDecorate %15 15 Offset 15 
                                                      OpMemberDecorate %15 16 Offset 15 
                                                      OpMemberDecorate %15 17 Offset 15 
                                                      OpMemberDecorate %15 18 Offset 15 
                                                      OpMemberDecorate %15 19 Offset 15 
                                                      OpMemberDecorate %15 20 Offset 15 
                                                      OpMemberDecorate %15 21 Offset 15 
                                                      OpMemberDecorate %15 22 Offset 15 
                                                      OpMemberDecorate %15 23 Offset 15 
                                                      OpMemberDecorate %15 24 Offset 15 
                                                      OpMemberDecorate %15 25 Offset 15 
                                                      OpMemberDecorate %15 26 Offset 15 
                                                      OpMemberDecorate %15 27 Offset 15 
                                                      OpMemberDecorate %15 28 Offset 15 
                                                      OpMemberDecorate %15 29 RelaxedPrecision 
                                                      OpMemberDecorate %15 29 Offset 15 
                                                      OpMemberDecorate %15 30 RelaxedPrecision 
                                                      OpMemberDecorate %15 30 Offset 15 
                                                      OpDecorate %15 Block 
                                                      OpDecorate %17 DescriptorSet 17 
                                                      OpDecorate %17 Binding 17 
                                                      OpDecorate %44 Location 44 
                                                      OpDecorate %76 RelaxedPrecision 
                                                      OpDecorate %80 RelaxedPrecision 
                                                      OpDecorate %80 DescriptorSet 80 
                                                      OpDecorate %80 Binding 80 
                                                      OpDecorate %81 RelaxedPrecision 
                                                      OpDecorate %85 RelaxedPrecision 
                                                      OpDecorate %86 RelaxedPrecision 
                                                      OpDecorate %106 RelaxedPrecision 
                                                      OpDecorate %109 RelaxedPrecision 
                                                      OpDecorate %110 RelaxedPrecision 
                                                      OpDecorate %114 RelaxedPrecision 
                                                      OpDecorate %120 RelaxedPrecision 
                                                      OpDecorate %122 RelaxedPrecision 
                                                      OpDecorate %147 RelaxedPrecision 
                                                      OpDecorate %148 RelaxedPrecision 
                                                      OpDecorate %148 DescriptorSet 148 
                                                      OpDecorate %148 Binding 148 
                                                      OpDecorate %149 RelaxedPrecision 
                                                      OpDecorate %153 RelaxedPrecision 
                                                      OpDecorate %167 RelaxedPrecision 
                                                      OpDecorate %169 RelaxedPrecision 
                                                      OpDecorate %177 RelaxedPrecision 
                                                      OpDecorate %191 RelaxedPrecision 
                                                      OpDecorate %192 RelaxedPrecision 
                                                      OpDecorate %192 DescriptorSet 192 
                                                      OpDecorate %192 Binding 192 
                                                      OpDecorate %193 RelaxedPrecision 
                                                      OpDecorate %196 RelaxedPrecision 
                                                      OpDecorate %197 RelaxedPrecision 
                                                      OpDecorate %218 RelaxedPrecision 
                                                      OpDecorate %220 RelaxedPrecision 
                                                      OpDecorate %231 RelaxedPrecision 
                                                      OpDecorate %247 RelaxedPrecision 
                                                      OpDecorate %247 DescriptorSet 247 
                                                      OpDecorate %247 Binding 247 
                                                      OpDecorate %248 RelaxedPrecision 
                                                      OpDecorate %252 RelaxedPrecision 
                                                      OpDecorate %268 RelaxedPrecision 
                                                      OpDecorate %270 RelaxedPrecision 
                                                      OpDecorate %281 RelaxedPrecision 
                                                      OpDecorate %282 RelaxedPrecision 
                                                      OpDecorate %282 DescriptorSet 282 
                                                      OpDecorate %282 Binding 282 
                                                      OpDecorate %283 RelaxedPrecision 
                                                      OpDecorate %287 RelaxedPrecision 
                                                      OpDecorate %288 RelaxedPrecision 
                                                      OpDecorate %304 RelaxedPrecision 
                                                      OpDecorate %311 RelaxedPrecision 
                                                      OpDecorate %347 RelaxedPrecision 
                                                      OpDecorate %349 RelaxedPrecision 
                                                      OpDecorate %368 RelaxedPrecision 
                                                      OpDecorate %368 DescriptorSet 368 
                                                      OpDecorate %368 Binding 368 
                                                      OpDecorate %369 RelaxedPrecision 
                                                      OpDecorate %372 RelaxedPrecision 
                                                      OpDecorate %373 RelaxedPrecision 
                                                      OpDecorate %463 RelaxedPrecision 
                                                      OpDecorate %464 RelaxedPrecision 
                                                      OpDecorate %464 DescriptorSet 464 
                                                      OpDecorate %464 Binding 464 
                                                      OpDecorate %465 RelaxedPrecision 
                                                      OpDecorate %469 RelaxedPrecision 
                                                      OpDecorate %470 RelaxedPrecision 
                                                      OpDecorate %500 RelaxedPrecision 
                                                      OpDecorate %501 RelaxedPrecision 
                                                      OpDecorate %501 DescriptorSet 501 
                                                      OpDecorate %501 Binding 501 
                                                      OpDecorate %502 RelaxedPrecision 
                                                      OpDecorate %506 RelaxedPrecision 
                                                      OpDecorate %507 RelaxedPrecision 
                                                      OpDecorate %549 RelaxedPrecision 
                                                      OpDecorate %553 RelaxedPrecision 
                                                      OpDecorate %568 RelaxedPrecision 
                                                      OpDecorate %568 Location 568 
                                               %2 = OpTypeVoid 
                                               %3 = OpTypeFunction %2 
                                               %6 = OpTypeFloat 32 
                                               %7 = OpTypeVector %6 4 
                                               %8 = OpTypePointer Private %7 
                                Private f32_4* %9 = OpVariable Private 
                                              %10 = OpTypePointer Input %7 
                                 Input f32_4* %11 = OpVariable Input 
                                              %12 = OpTypeVector %6 2 
                                              %15 = OpTypeStruct %7 %7 %7 %6 %6 %6 %6 %6 %7 %7 %6 %6 %7 %6 %6 %7 %6 %7 %6 %7 %6 %6 %7 %6 %7 %6 %7 %6 %6 %6 %6 
                                              %16 = OpTypePointer Uniform %15 
Uniform struct {f32_4; f32_4; f32_4; f32; f32; f32; f32; f32; f32_4; f32_4; f32; f32; f32_4; f32; f32; f32_4; f32; f32_4; f32; f32_4; f32; f32; f32_4; f32; f32_4; f32; f32_4; f32; f32; f32; f32;}* %17 = OpVariable Uniform 
                                              %18 = OpTypeInt 32 1 
                                          i32 %19 = OpConstant 17 
                                              %20 = OpTypePointer Uniform %7 
                                              %31 = OpTypePointer Private %12 
                               Private f32_2* %32 = OpVariable Private 
                                          i32 %33 = OpConstant 18 
                                              %34 = OpTypePointer Uniform %6 
                                          f32 %37 = OpConstant 3.674022E-40 
                                              %39 = OpTypeInt 32 0 
                                          u32 %40 = OpConstant 0 
                                              %41 = OpTypePointer Private %6 
                                 Private f32* %43 = OpVariable Private 
                                 Input f32_4* %44 = OpVariable Input 
                                              %45 = OpTypeVector %6 3 
                                              %53 = OpTypePointer Private %45 
                               Private f32_3* %54 = OpVariable Private 
                                          f32 %68 = OpConstant 3.674022E-40 
                                        f32_2 %69 = OpConstantComposite %68 %68 
                                 Private f32* %76 = OpVariable Private 
                                              %77 = OpTypeImage %6 Dim2D 0 0 0 1 Unknown 
                                              %78 = OpTypeSampledImage %77 
                                              %79 = OpTypePointer UniformConstant %78 
  UniformConstant read_only Texture2DSampled* %80 = OpVariable UniformConstant 
                                          i32 %87 = OpConstant 16 
                               Private f32_3* %92 = OpVariable Private 
                                          i32 %95 = OpConstant 9 
                                Private f32* %106 = OpVariable Private 
                                         i32 %107 = OpConstant 3 
                              Private f32_2* %111 = OpVariable Private 
                                         i32 %118 = OpConstant 4 
                                         i32 %133 = OpConstant 0 
                                         i32 %137 = OpConstant 10 
                                Private f32* %147 = OpVariable Private 
 UniformConstant read_only Texture2DSampled* %148 = OpVariable UniformConstant 
                                         i32 %156 = OpConstant 8 
                                         i32 %179 = OpConstant 11 
                                Private f32* %191 = OpVariable Private 
 UniformConstant read_only Texture2DSampled* %192 = OpVariable UniformConstant 
                              Private f32_3* %202 = OpVariable Private 
                                         i32 %205 = OpConstant 15 
 UniformConstant read_only Texture2DSampled* %247 = OpVariable UniformConstant 
                                         i32 %255 = OpConstant 12 
                                Private f32* %281 = OpVariable Private 
 UniformConstant read_only Texture2DSampled* %282 = OpVariable UniformConstant 
                                         i32 %289 = OpConstant 13 
                                         i32 %294 = OpConstant 14 
                                         f32 %299 = OpConstant 3.674022E-40 
                                         f32 %300 = OpConstant 3.674022E-40 
                                         i32 %327 = OpConstant 21 
                                         i32 %334 = OpConstant 2 
                                         i32 %361 = OpConstant 5 
 UniformConstant read_only Texture2DSampled* %368 = OpVariable UniformConstant 
                                         i32 %374 = OpConstant 6 
                                         i32 %380 = OpConstant 1 
                                         i32 %386 = OpConstant 7 
                              Private f32_3* %406 = OpVariable Private 
                                         i32 %407 = OpConstant 19 
                                         i32 %411 = OpConstant 20 
                                         i32 %424 = OpConstant 22 
                                         i32 %433 = OpConstant 25 
                                         i32 %447 = OpConstant 24 
                                Private f32* %463 = OpVariable Private 
 UniformConstant read_only Texture2DSampled* %464 = OpVariable UniformConstant 
                                         i32 %471 = OpConstant 23 
                                         i32 %478 = OpConstant 26 
                                         u32 %489 = OpConstant 1 
                                         i32 %492 = OpConstant 27 
                              Private f32_3* %500 = OpVariable Private 
 UniformConstant read_only Texture2DSampled* %501 = OpVariable UniformConstant 
                                         i32 %529 = OpConstant 28 
                                             %544 = OpTypePointer Input %6 
                                         i32 %547 = OpConstant 29 
                                         i32 %551 = OpConstant 30 
                                         u32 %561 = OpConstant 3 
                                             %567 = OpTypePointer Output %7 
                               Output f32_4* %568 = OpVariable Output 
                                          void %4 = OpFunction None %3 
                                               %5 = OpLabel 
                                        f32_4 %13 = OpLoad %11 
                                        f32_2 %14 = OpVectorShuffle %13 %13 0 1 
                               Uniform f32_4* %21 = OpAccessChain %17 %19 
                                        f32_4 %22 = OpLoad %21 
                                        f32_2 %23 = OpVectorShuffle %22 %22 0 1 
                                        f32_2 %24 = OpFMul %14 %23 
                               Uniform f32_4* %25 = OpAccessChain %17 %19 
                                        f32_4 %26 = OpLoad %25 
                                        f32_2 %27 = OpVectorShuffle %26 %26 2 3 
                                        f32_2 %28 = OpFAdd %24 %27 
                                        f32_4 %29 = OpLoad %9 
                                        f32_4 %30 = OpVectorShuffle %29 %28 4 5 2 3 
                                                      OpStore %9 %30 
                                 Uniform f32* %35 = OpAccessChain %17 %33 
                                          f32 %36 = OpLoad %35 
                                          f32 %38 = OpFAdd %36 %37 
                                 Private f32* %42 = OpAccessChain %32 %40 
                                                      OpStore %42 %38 
                                        f32_4 %46 = OpLoad %44 
                                        f32_3 %47 = OpVectorShuffle %46 %46 0 1 2 
                                        f32_4 %48 = OpLoad %44 
                                        f32_3 %49 = OpVectorShuffle %48 %48 0 1 2 
                                          f32 %50 = OpDot %47 %49 
                                                      OpStore %43 %50 
                                          f32 %51 = OpLoad %43 
                                          f32 %52 = OpExtInst %1 32 %51 
                                                      OpStore %43 %52 
                                          f32 %55 = OpLoad %43 
                                        f32_2 %56 = OpCompositeConstruct %55 %55 
                                        f32_4 %57 = OpLoad %44 
                                        f32_2 %58 = OpVectorShuffle %57 %57 0 1 
                                        f32_2 %59 = OpFMul %56 %58 
                                        f32_3 %60 = OpLoad %54 
                                        f32_3 %61 = OpVectorShuffle %60 %59 3 4 2 
                                                      OpStore %54 %61 
                                        f32_2 %62 = OpLoad %32 
                                        f32_2 %63 = OpVectorShuffle %62 %62 0 0 
                                        f32_3 %64 = OpLoad %54 
                                        f32_2 %65 = OpVectorShuffle %64 %64 0 1 
                                        f32_2 %66 = OpFMul %63 %65 
                                                      OpStore %32 %66 
                                        f32_2 %67 = OpLoad %32 
                                        f32_2 %70 = OpFMul %67 %69 
                                        f32_4 %71 = OpLoad %9 
                                        f32_2 %72 = OpVectorShuffle %71 %71 0 1 
                                        f32_2 %73 = OpFAdd %70 %72 
                                        f32_4 %74 = OpLoad %9 
                                        f32_4 %75 = OpVectorShuffle %74 %73 4 5 2 3 
                                                      OpStore %9 %75 
                   read_only Texture2DSampled %81 = OpLoad %80 
                                        f32_4 %82 = OpLoad %9 
                                        f32_2 %83 = OpVectorShuffle %82 %82 0 1 
                                        f32_4 %84 = OpImageSampleImplicitLod %81 %83 
                                          f32 %85 = OpCompositeExtract %84 0 
                                                      OpStore %76 %85 
                                          f32 %86 = OpLoad %76 
                                 Uniform f32* %88 = OpAccessChain %17 %87 
                                          f32 %89 = OpLoad %88 
                                          f32 %90 = OpFMul %86 %89 
                                 Private f32* %91 = OpAccessChain %9 %40 
                                                      OpStore %91 %90 
                                        f32_4 %93 = OpLoad %11 
                                        f32_2 %94 = OpVectorShuffle %93 %93 0 1 
                               Uniform f32_4* %96 = OpAccessChain %17 %95 
                                        f32_4 %97 = OpLoad %96 
                                        f32_2 %98 = OpVectorShuffle %97 %97 0 1 
                                        f32_2 %99 = OpFMul %94 %98 
                              Uniform f32_4* %100 = OpAccessChain %17 %95 
                                       f32_4 %101 = OpLoad %100 
                                       f32_2 %102 = OpVectorShuffle %101 %101 2 3 
                                       f32_2 %103 = OpFAdd %99 %102 
                                       f32_3 %104 = OpLoad %92 
                                       f32_3 %105 = OpVectorShuffle %104 %103 3 4 2 
                                                      OpStore %92 %105 
                                Uniform f32* %108 = OpAccessChain %17 %107 
                                         f32 %109 = OpLoad %108 
                                         f32 %110 = OpFAdd %109 %37 
                                                      OpStore %106 %110 
                                       f32_3 %112 = OpLoad %54 
                                       f32_2 %113 = OpVectorShuffle %112 %112 0 1 
                                         f32 %114 = OpLoad %106 
                                       f32_2 %115 = OpCompositeConstruct %114 %114 
                                       f32_2 %116 = OpFMul %113 %115 
                                                      OpStore %111 %116 
                                       f32_2 %117 = OpLoad %111 
                                Uniform f32* %119 = OpAccessChain %17 %118 
                                         f32 %120 = OpLoad %119 
                                Uniform f32* %121 = OpAccessChain %17 %118 
                                         f32 %122 = OpLoad %121 
                                       f32_2 %123 = OpCompositeConstruct %120 %122 
                                         f32 %124 = OpCompositeExtract %123 0 
                                         f32 %125 = OpCompositeExtract %123 1 
                                       f32_2 %126 = OpCompositeConstruct %124 %125 
                                       f32_2 %127 = OpFMul %117 %126 
                                       f32_3 %128 = OpLoad %92 
                                       f32_2 %129 = OpVectorShuffle %128 %128 0 1 
                                       f32_2 %130 = OpFAdd %127 %129 
                                       f32_3 %131 = OpLoad %92 
                                       f32_3 %132 = OpVectorShuffle %131 %130 3 4 2 
                                                      OpStore %92 %132 
                              Uniform f32_4* %134 = OpAccessChain %17 %133 
                                       f32_4 %135 = OpLoad %134 
                                       f32_2 %136 = OpVectorShuffle %135 %135 1 1 
                                Uniform f32* %138 = OpAccessChain %17 %137 
                                         f32 %139 = OpLoad %138 
                                       f32_2 %140 = OpCompositeConstruct %139 %139 
                                       f32_2 %141 = OpFMul %136 %140 
                                       f32_3 %142 = OpLoad %92 
                                       f32_2 %143 = OpVectorShuffle %142 %142 0 1 
                                       f32_2 %144 = OpFAdd %141 %143 
                                       f32_3 %145 = OpLoad %92 
                                       f32_3 %146 = OpVectorShuffle %145 %144 3 4 2 
                                                      OpStore %92 %146 
                  read_only Texture2DSampled %149 = OpLoad %148 
                                       f32_3 %150 = OpLoad %92 
                                       f32_2 %151 = OpVectorShuffle %150 %150 0 1 
                                       f32_4 %152 = OpImageSampleImplicitLod %149 %151 
                                         f32 %153 = OpCompositeExtract %152 0 
                                                      OpStore %147 %153 
                                       f32_4 %154 = OpLoad %11 
                                       f32_2 %155 = OpVectorShuffle %154 %154 0 1 
                              Uniform f32_4* %157 = OpAccessChain %17 %156 
                                       f32_4 %158 = OpLoad %157 
                                       f32_2 %159 = OpVectorShuffle %158 %158 0 1 
                                       f32_2 %160 = OpFMul %155 %159 
                              Uniform f32_4* %161 = OpAccessChain %17 %156 
                                       f32_4 %162 = OpLoad %161 
                                       f32_2 %163 = OpVectorShuffle %162 %162 2 3 
                                       f32_2 %164 = OpFAdd %160 %163 
                                                      OpStore %32 %164 
                                       f32_2 %165 = OpLoad %111 
                                Uniform f32* %166 = OpAccessChain %17 %118 
                                         f32 %167 = OpLoad %166 
                                Uniform f32* %168 = OpAccessChain %17 %118 
                                         f32 %169 = OpLoad %168 
                                       f32_2 %170 = OpCompositeConstruct %167 %169 
                                         f32 %171 = OpCompositeExtract %170 0 
                                         f32 %172 = OpCompositeExtract %170 1 
                                       f32_2 %173 = OpCompositeConstruct %171 %172 
                                       f32_2 %174 = OpFMul %165 %173 
                                       f32_2 %175 = OpLoad %32 
                                       f32_2 %176 = OpFAdd %174 %175 
                                                      OpStore %32 %176 
                                         f32 %177 = OpLoad %147 
                                       f32_2 %178 = OpCompositeConstruct %177 %177 
                                Uniform f32* %180 = OpAccessChain %17 %179 
                                         f32 %181 = OpLoad %180 
                                Uniform f32* %182 = OpAccessChain %17 %179 
                                         f32 %183 = OpLoad %182 
                                       f32_2 %184 = OpCompositeConstruct %181 %183 
                                         f32 %185 = OpCompositeExtract %184 0 
                                         f32 %186 = OpCompositeExtract %184 1 
                                       f32_2 %187 = OpCompositeConstruct %185 %186 
                                       f32_2 %188 = OpFMul %178 %187 
                                       f32_2 %189 = OpLoad %32 
                                       f32_2 %190 = OpFAdd %188 %189 
                                                      OpStore %32 %190 
                  read_only Texture2DSampled %193 = OpLoad %192 
                                       f32_2 %194 = OpLoad %32 
                                       f32_4 %195 = OpImageSampleImplicitLod %193 %194 
                                         f32 %196 = OpCompositeExtract %195 0 
                                                      OpStore %191 %196 
                                         f32 %197 = OpLoad %191 
                                Private f32* %198 = OpAccessChain %9 %40 
                                         f32 %199 = OpLoad %198 
                                         f32 %200 = OpFMul %197 %199 
                                Private f32* %201 = OpAccessChain %9 %40 
                                                      OpStore %201 %200 
                                       f32_4 %203 = OpLoad %11 
                                       f32_2 %204 = OpVectorShuffle %203 %203 0 1 
                              Uniform f32_4* %206 = OpAccessChain %17 %205 
                                       f32_4 %207 = OpLoad %206 
                                       f32_2 %208 = OpVectorShuffle %207 %207 0 1 
                                       f32_2 %209 = OpFMul %204 %208 
                              Uniform f32_4* %210 = OpAccessChain %17 %205 
                                       f32_4 %211 = OpLoad %210 
                                       f32_2 %212 = OpVectorShuffle %211 %211 2 3 
                                       f32_2 %213 = OpFAdd %209 %212 
                                       f32_3 %214 = OpLoad %202 
                                       f32_3 %215 = OpVectorShuffle %214 %213 3 4 2 
                                                      OpStore %202 %215 
                                       f32_2 %216 = OpLoad %111 
                                Uniform f32* %217 = OpAccessChain %17 %118 
                                         f32 %218 = OpLoad %217 
                                Uniform f32* %219 = OpAccessChain %17 %118 
                                         f32 %220 = OpLoad %219 
                                       f32_2 %221 = OpCompositeConstruct %218 %220 
                                         f32 %222 = OpCompositeExtract %221 0 
                                         f32 %223 = OpCompositeExtract %221 1 
                                       f32_2 %224 = OpCompositeConstruct %222 %223 
                                       f32_2 %225 = OpFMul %216 %224 
                                       f32_3 %226 = OpLoad %202 
                                       f32_2 %227 = OpVectorShuffle %226 %226 0 1 
                                       f32_2 %228 = OpFAdd %225 %227 
                                       f32_3 %229 = OpLoad %202 
                                       f32_3 %230 = OpVectorShuffle %229 %228 3 4 2 
                                                      OpStore %202 %230 
                                         f32 %231 = OpLoad %147 
                                       f32_2 %232 = OpCompositeConstruct %231 %231 
                                Uniform f32* %233 = OpAccessChain %17 %179 
                                         f32 %234 = OpLoad %233 
                                Uniform f32* %235 = OpAccessChain %17 %179 
                                         f32 %236 = OpLoad %235 
                                       f32_2 %237 = OpCompositeConstruct %234 %236 
                                         f32 %238 = OpCompositeExtract %237 0 
                                         f32 %239 = OpCompositeExtract %237 1 
                                       f32_2 %240 = OpCompositeConstruct %238 %239 
                                       f32_2 %241 = OpFMul %232 %240 
                                       f32_3 %242 = OpLoad %202 
                                       f32_2 %243 = OpVectorShuffle %242 %242 0 1 
                                       f32_2 %244 = OpFAdd %241 %243 
                                       f32_3 %245 = OpLoad %92 
                                       f32_3 %246 = OpVectorShuffle %245 %244 3 1 4 
                                                      OpStore %92 %246 
                  read_only Texture2DSampled %248 = OpLoad %247 
                                       f32_3 %249 = OpLoad %92 
                                       f32_2 %250 = OpVectorShuffle %249 %249 0 2 
                                       f32_4 %251 = OpImageSampleImplicitLod %248 %250 
                                         f32 %252 = OpCompositeExtract %251 0 
                                                      OpStore %147 %252 
                                       f32_4 %253 = OpLoad %11 
                                       f32_2 %254 = OpVectorShuffle %253 %253 0 1 
                              Uniform f32_4* %256 = OpAccessChain %17 %255 
                                       f32_4 %257 = OpLoad %256 
                                       f32_2 %258 = OpVectorShuffle %257 %257 0 1 
                                       f32_2 %259 = OpFMul %254 %258 
                              Uniform f32_4* %260 = OpAccessChain %17 %255 
                                       f32_4 %261 = OpLoad %260 
                                       f32_2 %262 = OpVectorShuffle %261 %261 2 3 
                                       f32_2 %263 = OpFAdd %259 %262 
                                       f32_3 %264 = OpLoad %202 
                                       f32_3 %265 = OpVectorShuffle %264 %263 3 4 2 
                                                      OpStore %202 %265 
                                       f32_2 %266 = OpLoad %111 
                                Uniform f32* %267 = OpAccessChain %17 %118 
                                         f32 %268 = OpLoad %267 
                                Uniform f32* %269 = OpAccessChain %17 %118 
                                         f32 %270 = OpLoad %269 
                                       f32_2 %271 = OpCompositeConstruct %268 %270 
                                         f32 %272 = OpCompositeExtract %271 0 
                                         f32 %273 = OpCompositeExtract %271 1 
                                       f32_2 %274 = OpCompositeConstruct %272 %273 
                                       f32_2 %275 = OpFMul %266 %274 
                                       f32_3 %276 = OpLoad %202 
                                       f32_2 %277 = OpVectorShuffle %276 %276 0 1 
                                       f32_2 %278 = OpFAdd %275 %277 
                                       f32_3 %279 = OpLoad %202 
                                       f32_3 %280 = OpVectorShuffle %279 %278 3 4 2 
                                                      OpStore %202 %280 
                  read_only Texture2DSampled %283 = OpLoad %282 
                                       f32_3 %284 = OpLoad %202 
                                       f32_2 %285 = OpVectorShuffle %284 %284 0 1 
                                       f32_4 %286 = OpImageSampleImplicitLod %283 %285 
                                         f32 %287 = OpCompositeExtract %286 0 
                                                      OpStore %281 %287 
                                         f32 %288 = OpLoad %281 
                                Uniform f32* %290 = OpAccessChain %17 %289 
                                         f32 %291 = OpLoad %290 
                                         f32 %292 = OpFAdd %288 %291 
                                                      OpStore %43 %292 
                                         f32 %293 = OpLoad %43 
                                Uniform f32* %295 = OpAccessChain %17 %294 
                                         f32 %296 = OpLoad %295 
                                         f32 %297 = OpFMul %293 %296 
                                                      OpStore %43 %297 
                                         f32 %298 = OpLoad %43 
                                         f32 %301 = OpExtInst %1 43 %298 %299 %300 
                                                      OpStore %43 %301 
                                         f32 %302 = OpLoad %43 
                                         f32 %303 = OpFAdd %302 %37 
                                                      OpStore %43 %303 
                                         f32 %304 = OpLoad %147 
                                         f32 %305 = OpLoad %43 
                                         f32 %306 = OpFMul %304 %305 
                                         f32 %307 = OpFAdd %306 %300 
                                Private f32* %308 = OpAccessChain %92 %40 
                                                      OpStore %308 %307 
                                Private f32* %309 = OpAccessChain %92 %40 
                                         f32 %310 = OpLoad %309 
                                         f32 %311 = OpLoad %191 
                                         f32 %312 = OpFMul %310 %311 
                                Private f32* %313 = OpAccessChain %32 %40 
                                                      OpStore %313 %312 
                                Private f32* %314 = OpAccessChain %92 %40 
                                         f32 %315 = OpLoad %314 
                                         f32 %316 = OpFNegate %315 
                                         f32 %317 = OpFAdd %316 %300 
                                Private f32* %318 = OpAccessChain %92 %40 
                                                      OpStore %318 %317 
                                Private f32* %319 = OpAccessChain %92 %40 
                                         f32 %320 = OpLoad %319 
                                Private f32* %321 = OpAccessChain %32 %40 
                                         f32 %322 = OpLoad %321 
                                         f32 %323 = OpFMul %320 %322 
                                Private f32* %324 = OpAccessChain %92 %40 
                                                      OpStore %324 %323 
                                Private f32* %325 = OpAccessChain %92 %40 
                                         f32 %326 = OpLoad %325 
                                Uniform f32* %328 = OpAccessChain %17 %327 
                                         f32 %329 = OpLoad %328 
                                         f32 %330 = OpFMul %326 %329 
                                Private f32* %331 = OpAccessChain %92 %40 
                                                      OpStore %331 %330 
                                       f32_4 %332 = OpLoad %11 
                                       f32_2 %333 = OpVectorShuffle %332 %332 0 1 
                              Uniform f32_4* %335 = OpAccessChain %17 %334 
                                       f32_4 %336 = OpLoad %335 
                                       f32_2 %337 = OpVectorShuffle %336 %336 0 1 
                                       f32_2 %338 = OpFMul %333 %337 
                              Uniform f32_4* %339 = OpAccessChain %17 %334 
                                       f32_4 %340 = OpLoad %339 
                                       f32_2 %341 = OpVectorShuffle %340 %340 2 3 
                                       f32_2 %342 = OpFAdd %338 %341 
                                       f32_3 %343 = OpLoad %202 
                                       f32_3 %344 = OpVectorShuffle %343 %342 3 4 2 
                                                      OpStore %202 %344 
                                       f32_2 %345 = OpLoad %111 
                                Uniform f32* %346 = OpAccessChain %17 %118 
                                         f32 %347 = OpLoad %346 
                                Uniform f32* %348 = OpAccessChain %17 %118 
                                         f32 %349 = OpLoad %348 
                                       f32_2 %350 = OpCompositeConstruct %347 %349 
                                         f32 %351 = OpCompositeExtract %350 0 
                                         f32 %352 = OpCompositeExtract %350 1 
                                       f32_2 %353 = OpCompositeConstruct %351 %352 
                                       f32_2 %354 = OpFMul %345 %353 
                                       f32_3 %355 = OpLoad %202 
                                       f32_2 %356 = OpVectorShuffle %355 %355 0 1 
                                       f32_2 %357 = OpFAdd %354 %356 
                                                      OpStore %111 %357 
                              Uniform f32_4* %358 = OpAccessChain %17 %133 
                                       f32_4 %359 = OpLoad %358 
                                       f32_2 %360 = OpVectorShuffle %359 %359 1 1 
                                Uniform f32* %362 = OpAccessChain %17 %361 
                                         f32 %363 = OpLoad %362 
                                       f32_2 %364 = OpCompositeConstruct %363 %363 
                                       f32_2 %365 = OpFMul %360 %364 
                                       f32_2 %366 = OpLoad %111 
                                       f32_2 %367 = OpFAdd %365 %366 
                                                      OpStore %111 %367 
                  read_only Texture2DSampled %369 = OpLoad %368 
                                       f32_2 %370 = OpLoad %111 
                                       f32_4 %371 = OpImageSampleImplicitLod %369 %370 
                                         f32 %372 = OpCompositeExtract %371 0 
                                                      OpStore %281 %372 
                                         f32 %373 = OpLoad %281 
                                Uniform f32* %375 = OpAccessChain %17 %374 
                                         f32 %376 = OpLoad %375 
                                         f32 %377 = OpFAdd %373 %376 
                                                      OpStore %43 %377 
                                         f32 %378 = OpLoad %43 
                                       f32_3 %379 = OpCompositeConstruct %378 %378 %378 
                              Uniform f32_4* %381 = OpAccessChain %17 %380 
                                       f32_4 %382 = OpLoad %381 
                                       f32_3 %383 = OpVectorShuffle %382 %382 0 1 2 
                                       f32_3 %384 = OpFMul %379 %383 
                                                      OpStore %202 %384 
                                       f32_3 %385 = OpLoad %202 
                                Uniform f32* %387 = OpAccessChain %17 %386 
                                         f32 %388 = OpLoad %387 
                                Uniform f32* %389 = OpAccessChain %17 %386 
                                         f32 %390 = OpLoad %389 
                                Uniform f32* %391 = OpAccessChain %17 %386 
                                         f32 %392 = OpLoad %391 
                                       f32_3 %393 = OpCompositeConstruct %388 %390 %392 
                                         f32 %394 = OpCompositeExtract %393 0 
                                         f32 %395 = OpCompositeExtract %393 1 
                                         f32 %396 = OpCompositeExtract %393 2 
                                       f32_3 %397 = OpCompositeConstruct %394 %395 %396 
                                       f32_3 %398 = OpFMul %385 %397 
                                                      OpStore %202 %398 
                                       f32_3 %399 = OpLoad %202 
                                       f32_2 %400 = OpLoad %32 
                                       f32_3 %401 = OpVectorShuffle %400 %400 0 0 0 
                                       f32_3 %402 = OpFMul %399 %401 
                                       f32_4 %403 = OpLoad %9 
                                       f32_3 %404 = OpVectorShuffle %403 %403 0 0 0 
                                       f32_3 %405 = OpFAdd %402 %404 
                                                      OpStore %202 %405 
                              Uniform f32_4* %408 = OpAccessChain %17 %407 
                                       f32_4 %409 = OpLoad %408 
                                       f32_3 %410 = OpVectorShuffle %409 %409 0 1 2 
                                Uniform f32* %412 = OpAccessChain %17 %411 
                                         f32 %413 = OpLoad %412 
                                       f32_3 %414 = OpCompositeConstruct %413 %413 %413 
                                       f32_3 %415 = OpFMul %410 %414 
                                                      OpStore %406 %415 
                                       f32_3 %416 = OpLoad %406 
                                       f32_2 %417 = OpLoad %32 
                                       f32_3 %418 = OpVectorShuffle %417 %417 0 0 0 
                                       f32_3 %419 = OpFMul %416 %418 
                                       f32_3 %420 = OpLoad %202 
                                       f32_3 %421 = OpFAdd %419 %420 
                                                      OpStore %202 %421 
                                       f32_3 %422 = OpLoad %92 
                                       f32_3 %423 = OpVectorShuffle %422 %422 0 0 0 
                              Uniform f32_4* %425 = OpAccessChain %17 %424 
                                       f32_4 %426 = OpLoad %425 
                                       f32_3 %427 = OpVectorShuffle %426 %426 0 1 2 
                                       f32_3 %428 = OpFMul %423 %427 
                                       f32_3 %429 = OpLoad %202 
                                       f32_3 %430 = OpFAdd %428 %429 
                                       f32_4 %431 = OpLoad %9 
                                       f32_4 %432 = OpVectorShuffle %431 %430 4 5 2 6 
                                                      OpStore %9 %432 
                                Uniform f32* %434 = OpAccessChain %17 %433 
                                         f32 %435 = OpLoad %434 
                                         f32 %436 = OpFAdd %435 %37 
                                Private f32* %437 = OpAccessChain %111 %40 
                                                      OpStore %437 %436 
                                       f32_3 %438 = OpLoad %54 
                                       f32_2 %439 = OpVectorShuffle %438 %438 0 1 
                                       f32_2 %440 = OpLoad %111 
                                       f32_2 %441 = OpVectorShuffle %440 %440 0 0 
                                       f32_2 %442 = OpFMul %439 %441 
                                       f32_3 %443 = OpLoad %54 
                                       f32_3 %444 = OpVectorShuffle %443 %442 3 4 2 
                                                      OpStore %54 %444 
                                       f32_4 %445 = OpLoad %11 
                                       f32_2 %446 = OpVectorShuffle %445 %445 0 1 
                              Uniform f32_4* %448 = OpAccessChain %17 %447 
                                       f32_4 %449 = OpLoad %448 
                                       f32_2 %450 = OpVectorShuffle %449 %449 0 1 
                                       f32_2 %451 = OpFMul %446 %450 
                              Uniform f32_4* %452 = OpAccessChain %17 %447 
                                       f32_4 %453 = OpLoad %452 
                                       f32_2 %454 = OpVectorShuffle %453 %453 2 3 
                                       f32_2 %455 = OpFAdd %451 %454 
                                                      OpStore %111 %455 
                                       f32_3 %456 = OpLoad %54 
                                       f32_2 %457 = OpVectorShuffle %456 %456 0 1 
                                       f32_2 %458 = OpFMul %457 %69 
                                       f32_2 %459 = OpLoad %111 
                                       f32_2 %460 = OpFAdd %458 %459 
                                       f32_3 %461 = OpLoad %54 
                                       f32_3 %462 = OpVectorShuffle %461 %460 3 4 2 
                                                      OpStore %54 %462 
                  read_only Texture2DSampled %465 = OpLoad %464 
                                       f32_3 %466 = OpLoad %54 
                                       f32_2 %467 = OpVectorShuffle %466 %466 0 1 
                                       f32_4 %468 = OpImageSampleImplicitLod %465 %467 
                                         f32 %469 = OpCompositeExtract %468 0 
                                                      OpStore %463 %469 
                                         f32 %470 = OpLoad %463 
                                Uniform f32* %472 = OpAccessChain %17 %471 
                                         f32 %473 = OpLoad %472 
                                         f32 %474 = OpFMul %470 %473 
                                Private f32* %475 = OpAccessChain %54 %40 
                                                      OpStore %475 %474 
                                       f32_4 %476 = OpLoad %11 
                                       f32_2 %477 = OpVectorShuffle %476 %476 0 1 
                              Uniform f32_4* %479 = OpAccessChain %17 %478 
                                       f32_4 %480 = OpLoad %479 
                                       f32_2 %481 = OpVectorShuffle %480 %480 0 1 
                                       f32_2 %482 = OpFMul %477 %481 
                              Uniform f32_4* %483 = OpAccessChain %17 %478 
                                       f32_4 %484 = OpLoad %483 
                                       f32_2 %485 = OpVectorShuffle %484 %484 2 3 
                                       f32_2 %486 = OpFAdd %482 %485 
                                       f32_3 %487 = OpLoad %202 
                                       f32_3 %488 = OpVectorShuffle %487 %486 0 3 4 
                                                      OpStore %202 %488 
                                Uniform f32* %490 = OpAccessChain %17 %133 %489 
                                         f32 %491 = OpLoad %490 
                                Uniform f32* %493 = OpAccessChain %17 %492 
                                         f32 %494 = OpLoad %493 
                                         f32 %495 = OpFMul %491 %494 
                                Private f32* %496 = OpAccessChain %202 %489 
                                         f32 %497 = OpLoad %496 
                                         f32 %498 = OpFAdd %495 %497 
                                Private f32* %499 = OpAccessChain %202 %40 
                                                      OpStore %499 %498 
                  read_only Texture2DSampled %502 = OpLoad %501 
                                       f32_3 %503 = OpLoad %202 
                                       f32_2 %504 = OpVectorShuffle %503 %503 0 2 
                                       f32_4 %505 = OpImageSampleImplicitLod %502 %504 
                                       f32_3 %506 = OpVectorShuffle %505 %505 0 1 2 
                                                      OpStore %500 %506 
                                       f32_3 %507 = OpLoad %500 
                                       f32_3 %508 = OpLoad %54 
                                       f32_3 %509 = OpVectorShuffle %508 %508 0 0 0 
                                       f32_3 %510 = OpFMul %507 %509 
                                                      OpStore %54 %510 
                                       f32_3 %511 = OpLoad %54 
                                       f32_2 %512 = OpLoad %32 
                                       f32_3 %513 = OpVectorShuffle %512 %512 0 0 0 
                                       f32_3 %514 = OpFMul %511 %513 
                                       f32_4 %515 = OpLoad %9 
                                       f32_3 %516 = OpVectorShuffle %515 %515 0 1 3 
                                       f32_3 %517 = OpFAdd %514 %516 
                                       f32_4 %518 = OpLoad %9 
                                       f32_4 %519 = OpVectorShuffle %518 %517 4 5 6 3 
                                                      OpStore %9 %519 
                                       f32_4 %520 = OpLoad %9 
                                       f32_3 %521 = OpVectorShuffle %520 %520 0 1 2 
                                       f32_3 %522 = OpCompositeConstruct %299 %299 %299 
                                       f32_3 %523 = OpCompositeConstruct %300 %300 %300 
                                       f32_3 %524 = OpExtInst %1 43 %521 %522 %523 
                                       f32_4 %525 = OpLoad %9 
                                       f32_4 %526 = OpVectorShuffle %525 %524 4 5 6 3 
                                                      OpStore %9 %526 
                                       f32_4 %527 = OpLoad %9 
                                       f32_3 %528 = OpVectorShuffle %527 %527 0 1 2 
                                Uniform f32* %530 = OpAccessChain %17 %529 
                                         f32 %531 = OpLoad %530 
                                Uniform f32* %532 = OpAccessChain %17 %529 
                                         f32 %533 = OpLoad %532 
                                Uniform f32* %534 = OpAccessChain %17 %529 
                                         f32 %535 = OpLoad %534 
                                       f32_3 %536 = OpCompositeConstruct %531 %533 %535 
                                         f32 %537 = OpCompositeExtract %536 0 
                                         f32 %538 = OpCompositeExtract %536 1 
                                         f32 %539 = OpCompositeExtract %536 2 
                                       f32_3 %540 = OpCompositeConstruct %537 %538 %539 
                                       f32_3 %541 = OpFMul %528 %540 
                                       f32_4 %542 = OpLoad %9 
                                       f32_4 %543 = OpVectorShuffle %542 %541 4 5 6 3 
                                                      OpStore %9 %543 
                                  Input f32* %545 = OpAccessChain %11 %489 
                                         f32 %546 = OpLoad %545 
                                Uniform f32* %548 = OpAccessChain %17 %547 
                                         f32 %549 = OpLoad %548 
                                         f32 %550 = OpFMul %546 %549 
                                Uniform f32* %552 = OpAccessChain %17 %551 
                                         f32 %553 = OpLoad %552 
                                         f32 %554 = OpFAdd %550 %553 
                                Private f32* %555 = OpAccessChain %54 %40 
                                                      OpStore %555 %554 
                                Private f32* %556 = OpAccessChain %9 %40 
                                         f32 %557 = OpLoad %556 
                                Private f32* %558 = OpAccessChain %54 %40 
                                         f32 %559 = OpLoad %558 
                                         f32 %560 = OpFMul %557 %559 
                                Private f32* %562 = OpAccessChain %9 %561 
                                                      OpStore %562 %560 
                                Private f32* %563 = OpAccessChain %9 %561 
                                         f32 %564 = OpLoad %563 
                                         f32 %565 = OpExtInst %1 43 %564 %299 %300 
                                Private f32* %566 = OpAccessChain %9 %561 
                                                      OpStore %566 %565 
                                       f32_4 %569 = OpLoad %9 
                                                      OpStore %568 %569 
                                                      OpReturn
                                                      OpFunctionEnd
"
}
SubProgram "d3d11 " {
Keywords { "INSTANCING_ON" }
"// shader disassembly not supported on DXBC"
}
SubProgram "vulkan " {
Keywords { "INSTANCING_ON" }
"; SPIR-V
; Version: 1.0
; Generator: Khronos Glslang Reference Front End; 1
; Bound: 349
; Schema: 0
                                                      OpCapability Shader 
                                               %1 = OpExtInstImport "GLSL.std.450" 
                                                      OpMemoryModel Logical GLSL450 
                                                      OpEntryPoint Vertex %4 "main" %10 %19 %97 %119 %120 %122 %123 %125 %126 %128 %129 %132 %137 %178 %332 
                                                      OpDecorate %10 BuiltIn ViewportIndex 
                                                      OpDecorate %19 Location 19 
                                                      OpDecorate %24 ArrayStride 24 
                                                      OpDecorate %25 ArrayStride 25 
                                                      OpMemberDecorate %26 0 Offset 26 
                                                      OpMemberDecorate %26 1 Offset 26 
                                                      OpDecorate %28 ArrayStride 28 
                                                      OpMemberDecorate %29 0 Offset 29 
                                                      OpDecorate %29 Block 
                                                      OpDecorate %31 DescriptorSet 31 
                                                      OpDecorate %31 Binding 31 
                                                      OpDecorate %65 ArrayStride 65 
                                                      OpMemberDecorate %66 0 Offset 66 
                                                      OpMemberDecorate %66 1 Offset 66 
                                                      OpMemberDecorate %66 2 Offset 66 
                                                      OpMemberDecorate %66 3 RelaxedPrecision 
                                                      OpMemberDecorate %66 3 Offset 66 
                                                      OpDecorate %66 Block 
                                                      OpDecorate %68 DescriptorSet 68 
                                                      OpDecorate %68 Binding 68 
                                                      OpMemberDecorate %95 0 BuiltIn 95 
                                                      OpMemberDecorate %95 1 BuiltIn 95 
                                                      OpMemberDecorate %95 2 BuiltIn 95 
                                                      OpDecorate %95 Block 
                                                      OpDecorate %100 RelaxedPrecision 
                                                      OpDecorate %101 RelaxedPrecision 
                                                      OpDecorate %119 Location 119 
                                                      OpDecorate %120 Location 120 
                                                      OpDecorate %122 Location 122 
                                                      OpDecorate %123 Location 123 
                                                      OpDecorate %125 Location 125 
                                                      OpDecorate %126 Location 126 
                                                      OpDecorate %128 Location 128 
                                                      OpDecorate %129 Location 129 
                                                      OpDecorate %132 Flat 
                                                      OpDecorate %132 Location 132 
                                                      OpDecorate %137 Location 137 
                                                      OpDecorate %178 Location 178 
                                                      OpDecorate %332 Location 332 
                                               %2 = OpTypeVoid 
                                               %3 = OpTypeFunction %2 
                                               %6 = OpTypeInt 32 1 
                                               %7 = OpTypePointer Private %6 
                                  Private i32* %8 = OpVariable Private 
                                               %9 = OpTypePointer Input %6 
                                   Input i32* %10 = OpVariable Input 
                                          i32 %12 = OpConstant 3 
                                              %14 = OpTypeFloat 32 
                                              %15 = OpTypeVector %14 4 
                                              %16 = OpTypePointer Private %15 
                               Private f32_4* %17 = OpVariable Private 
                                              %18 = OpTypePointer Input %15 
                                 Input f32_4* %19 = OpVariable Input 
                                              %22 = OpTypeInt 32 0 
                                          u32 %23 = OpConstant 4 
                                              %24 = OpTypeArray %15 %23 
                                              %25 = OpTypeArray %15 %23 
                                              %26 = OpTypeStruct %24 %25 
                                          u32 %27 = OpConstant 500 
                                              %28 = OpTypeArray %26 %27 
                                              %29 = OpTypeStruct %28 
                                              %30 = OpTypePointer Uniform %29 
Uniform struct {struct {f32_4[4]; f32_4[4];}[500];}* %31 = OpVariable Uniform 
                                          i32 %32 = OpConstant 0 
                                          i32 %34 = OpConstant 1 
                                              %35 = OpTypePointer Uniform %15 
                                          i32 %48 = OpConstant 2 
                               Private f32_4* %61 = OpVariable Private 
                                              %64 = OpTypeVector %14 3 
                                              %65 = OpTypeArray %15 %23 
                                              %66 = OpTypeStruct %64 %15 %65 %14 
                                              %67 = OpTypePointer Uniform %66 
Uniform struct {f32_3; f32_4; f32_4[4]; f32;}* %68 = OpVariable Uniform 
                                          u32 %93 = OpConstant 1 
                                              %94 = OpTypeArray %14 %93 
                                              %95 = OpTypeStruct %15 %14 %94 
                                              %96 = OpTypePointer Output %95 
         Output struct {f32_4; f32; f32[1];}* %97 = OpVariable Output 
                                              %98 = OpTypePointer Uniform %14 
                                         u32 %102 = OpConstant 3 
                                             %103 = OpTypePointer Private %14 
                                         u32 %107 = OpConstant 2 
                                             %111 = OpTypePointer Output %14 
                                             %115 = OpTypePointer Output %15 
                               Output f32_4* %119 = OpVariable Output 
                                Input f32_4* %120 = OpVariable Input 
                               Output f32_4* %122 = OpVariable Output 
                                Input f32_4* %123 = OpVariable Input 
                               Output f32_4* %125 = OpVariable Output 
                                Input f32_4* %126 = OpVariable Input 
                               Output f32_4* %128 = OpVariable Output 
                                Input f32_4* %129 = OpVariable Input 
                                             %131 = OpTypePointer Output %22 
                                 Output u32* %132 = OpVariable Output 
                                             %135 = OpTypePointer Private %64 
                              Private f32_3* %136 = OpVariable Private 
                                Input f32_4* %137 = OpVariable Input 
                                         u32 %166 = OpConstant 0 
                                             %177 = OpTypePointer Input %64 
                                Input f32_3* %178 = OpVariable Input 
                                Private f32* %200 = OpVariable Private 
                                             %233 = OpTypePointer Input %14 
                              Private f32_3* %246 = OpVariable Private 
                              Private f32_3* %250 = OpVariable Private 
                                             %287 = OpTypePointer Uniform %64 
                                Private f32* %291 = OpVariable Private 
                               Output f32_4* %332 = OpVariable Output 
                                         f32 %342 = OpConstant 3.674022E-40 
                                          void %4 = OpFunction None %3 
                                               %5 = OpLabel 
                                          i32 %11 = OpLoad %10 
                                          i32 %13 = OpShiftLeftLogical %11 %12 
                                                      OpStore %8 %13 
                                        f32_4 %20 = OpLoad %19 
                                        f32_4 %21 = OpVectorShuffle %20 %20 1 1 1 1 
                                          i32 %33 = OpLoad %10 
                               Uniform f32_4* %36 = OpAccessChain %31 %32 %33 %32 %34 
                                        f32_4 %37 = OpLoad %36 
                                        f32_4 %38 = OpFMul %21 %37 
                                                      OpStore %17 %38 
                                          i32 %39 = OpLoad %10 
                               Uniform f32_4* %40 = OpAccessChain %31 %32 %39 %32 %32 
                                        f32_4 %41 = OpLoad %40 
                                        f32_4 %42 = OpLoad %19 
                                        f32_4 %43 = OpVectorShuffle %42 %42 0 0 0 0 
                                        f32_4 %44 = OpFMul %41 %43 
                                        f32_4 %45 = OpLoad %17 
                                        f32_4 %46 = OpFAdd %44 %45 
                                                      OpStore %17 %46 
                                          i32 %47 = OpLoad %10 
                               Uniform f32_4* %49 = OpAccessChain %31 %32 %47 %32 %48 
                                        f32_4 %50 = OpLoad %49 
                                        f32_4 %51 = OpLoad %19 
                                        f32_4 %52 = OpVectorShuffle %51 %51 2 2 2 2 
                                        f32_4 %53 = OpFMul %50 %52 
                                        f32_4 %54 = OpLoad %17 
                                        f32_4 %55 = OpFAdd %53 %54 
                                                      OpStore %17 %55 
                                        f32_4 %56 = OpLoad %17 
                                          i32 %57 = OpLoad %10 
                               Uniform f32_4* %58 = OpAccessChain %31 %32 %57 %32 %12 
                                        f32_4 %59 = OpLoad %58 
                                        f32_4 %60 = OpFAdd %56 %59 
                                                      OpStore %17 %60 
                                        f32_4 %62 = OpLoad %17 
                                        f32_4 %63 = OpVectorShuffle %62 %62 1 1 1 1 
                               Uniform f32_4* %69 = OpAccessChain %68 %48 %34 
                                        f32_4 %70 = OpLoad %69 
                                        f32_4 %71 = OpFMul %63 %70 
                                                      OpStore %61 %71 
                               Uniform f32_4* %72 = OpAccessChain %68 %48 %32 
                                        f32_4 %73 = OpLoad %72 
                                        f32_4 %74 = OpLoad %17 
                                        f32_4 %75 = OpVectorShuffle %74 %74 0 0 0 0 
                                        f32_4 %76 = OpFMul %73 %75 
                                        f32_4 %77 = OpLoad %61 
                                        f32_4 %78 = OpFAdd %76 %77 
                                                      OpStore %61 %78 
                               Uniform f32_4* %79 = OpAccessChain %68 %48 %48 
                                        f32_4 %80 = OpLoad %79 
                                        f32_4 %81 = OpLoad %17 
                                        f32_4 %82 = OpVectorShuffle %81 %81 2 2 2 2 
                                        f32_4 %83 = OpFMul %80 %82 
                                        f32_4 %84 = OpLoad %61 
                                        f32_4 %85 = OpFAdd %83 %84 
                                                      OpStore %61 %85 
                               Uniform f32_4* %86 = OpAccessChain %68 %48 %12 
                                        f32_4 %87 = OpLoad %86 
                                        f32_4 %88 = OpLoad %17 
                                        f32_4 %89 = OpVectorShuffle %88 %88 3 3 3 3 
                                        f32_4 %90 = OpFMul %87 %89 
                                        f32_4 %91 = OpLoad %61 
                                        f32_4 %92 = OpFAdd %90 %91 
                                                      OpStore %17 %92 
                                 Uniform f32* %99 = OpAccessChain %68 %12 
                                         f32 %100 = OpLoad %99 
                                         f32 %101 = OpFNegate %100 
                                Private f32* %104 = OpAccessChain %17 %102 
                                         f32 %105 = OpLoad %104 
                                         f32 %106 = OpFMul %101 %105 
                                Private f32* %108 = OpAccessChain %17 %107 
                                         f32 %109 = OpLoad %108 
                                         f32 %110 = OpFAdd %106 %109 
                                 Output f32* %112 = OpAccessChain %97 %32 %107 
                                                      OpStore %112 %110 
                                       f32_4 %113 = OpLoad %17 
                                       f32_3 %114 = OpVectorShuffle %113 %113 0 1 3 
                               Output f32_4* %116 = OpAccessChain %97 %32 
                                       f32_4 %117 = OpLoad %116 
                                       f32_4 %118 = OpVectorShuffle %117 %114 4 5 2 6 
                                                      OpStore %116 %118 
                                       f32_4 %121 = OpLoad %120 
                                                      OpStore %119 %121 
                                       f32_4 %124 = OpLoad %123 
                                                      OpStore %122 %124 
                                       f32_4 %127 = OpLoad %126 
                                                      OpStore %125 %127 
                                       f32_4 %130 = OpLoad %129 
                                                      OpStore %128 %130 
                                         i32 %133 = OpLoad %10 
                                         u32 %134 = OpBitcast %133 
                                                      OpStore %132 %134 
                                       f32_4 %138 = OpLoad %137 
                                       f32_3 %139 = OpVectorShuffle %138 %138 1 1 1 
                                         i32 %140 = OpLoad %10 
                              Uniform f32_4* %141 = OpAccessChain %31 %32 %140 %32 %34 
                                       f32_4 %142 = OpLoad %141 
                                       f32_3 %143 = OpVectorShuffle %142 %142 1 2 0 
                                       f32_3 %144 = OpFMul %139 %143 
                                                      OpStore %136 %144 
                                         i32 %145 = OpLoad %10 
                              Uniform f32_4* %146 = OpAccessChain %31 %32 %145 %32 %32 
                                       f32_4 %147 = OpLoad %146 
                                       f32_3 %148 = OpVectorShuffle %147 %147 1 2 0 
                                       f32_4 %149 = OpLoad %137 
                                       f32_3 %150 = OpVectorShuffle %149 %149 0 0 0 
                                       f32_3 %151 = OpFMul %148 %150 
                                       f32_3 %152 = OpLoad %136 
                                       f32_3 %153 = OpFAdd %151 %152 
                                                      OpStore %136 %153 
                                         i32 %154 = OpLoad %10 
                              Uniform f32_4* %155 = OpAccessChain %31 %32 %154 %32 %48 
                                       f32_4 %156 = OpLoad %155 
                                       f32_3 %157 = OpVectorShuffle %156 %156 1 2 0 
                                       f32_4 %158 = OpLoad %137 
                                       f32_3 %159 = OpVectorShuffle %158 %158 2 2 2 
                                       f32_3 %160 = OpFMul %157 %159 
                                       f32_3 %161 = OpLoad %136 
                                       f32_3 %162 = OpFAdd %160 %161 
                                                      OpStore %136 %162 
                                       f32_3 %163 = OpLoad %136 
                                       f32_3 %164 = OpLoad %136 
                                         f32 %165 = OpDot %163 %164 
                                Private f32* %167 = OpAccessChain %17 %166 
                                                      OpStore %167 %165 
                                Private f32* %168 = OpAccessChain %17 %166 
                                         f32 %169 = OpLoad %168 
                                         f32 %170 = OpExtInst %1 32 %169 
                                Private f32* %171 = OpAccessChain %17 %166 
                                                      OpStore %171 %170 
                                       f32_3 %172 = OpLoad %136 
                                       f32_3 %173 = OpVectorShuffle %172 %172 1 0 2 
                                       f32_4 %174 = OpLoad %17 
                                       f32_3 %175 = OpVectorShuffle %174 %174 0 0 0 
                                       f32_3 %176 = OpFMul %173 %175 
                                                      OpStore %136 %176 
                                       f32_3 %179 = OpLoad %178 
                                         i32 %180 = OpLoad %10 
                              Uniform f32_4* %181 = OpAccessChain %31 %32 %180 %34 %32 
                                       f32_4 %182 = OpLoad %181 
                                       f32_3 %183 = OpVectorShuffle %182 %182 0 1 2 
                                         f32 %184 = OpDot %179 %183 
                                Private f32* %185 = OpAccessChain %17 %93 
                                                      OpStore %185 %184 
                                       f32_3 %186 = OpLoad %178 
                                         i32 %187 = OpLoad %10 
                              Uniform f32_4* %188 = OpAccessChain %31 %32 %187 %34 %34 
                                       f32_4 %189 = OpLoad %188 
                                       f32_3 %190 = OpVectorShuffle %189 %189 0 1 2 
                                         f32 %191 = OpDot %186 %190 
                                Private f32* %192 = OpAccessChain %17 %107 
                                                      OpStore %192 %191 
                                       f32_3 %193 = OpLoad %178 
                                         i32 %194 = OpLoad %10 
                              Uniform f32_4* %195 = OpAccessChain %31 %32 %194 %34 %48 
                                       f32_4 %196 = OpLoad %195 
                                       f32_3 %197 = OpVectorShuffle %196 %196 0 1 2 
                                         f32 %198 = OpDot %193 %197 
                                Private f32* %199 = OpAccessChain %17 %166 
                                                      OpStore %199 %198 
                                       f32_4 %201 = OpLoad %17 
                                       f32_3 %202 = OpVectorShuffle %201 %201 0 1 2 
                                       f32_4 %203 = OpLoad %17 
                                       f32_3 %204 = OpVectorShuffle %203 %203 0 1 2 
                                         f32 %205 = OpDot %202 %204 
                                                      OpStore %200 %205 
                                         f32 %206 = OpLoad %200 
                                         f32 %207 = OpExtInst %1 32 %206 
                                                      OpStore %200 %207 
                                         f32 %208 = OpLoad %200 
                                       f32_3 %209 = OpCompositeConstruct %208 %208 %208 
                                       f32_4 %210 = OpLoad %17 
                                       f32_3 %211 = OpVectorShuffle %210 %210 0 1 2 
                                       f32_3 %212 = OpFMul %209 %211 
                                       f32_4 %213 = OpLoad %17 
                                       f32_4 %214 = OpVectorShuffle %213 %212 4 5 6 3 
                                                      OpStore %17 %214 
                                       f32_3 %215 = OpLoad %136 
                                       f32_3 %216 = OpVectorShuffle %215 %215 1 0 2 
                                       f32_4 %217 = OpLoad %17 
                                       f32_3 %218 = OpVectorShuffle %217 %217 0 1 2 
                                       f32_3 %219 = OpFMul %216 %218 
                                       f32_4 %220 = OpLoad %61 
                                       f32_4 %221 = OpVectorShuffle %220 %219 4 5 6 3 
                                                      OpStore %61 %221 
                                       f32_4 %222 = OpLoad %17 
                                       f32_3 %223 = OpVectorShuffle %222 %222 2 0 1 
                                       f32_3 %224 = OpLoad %136 
                                       f32_3 %225 = OpVectorShuffle %224 %224 0 2 1 
                                       f32_3 %226 = OpFMul %223 %225 
                                       f32_4 %227 = OpLoad %61 
                                       f32_3 %228 = OpVectorShuffle %227 %227 0 1 2 
                                       f32_3 %229 = OpFNegate %228 
                                       f32_3 %230 = OpFAdd %226 %229 
                                       f32_4 %231 = OpLoad %61 
                                       f32_4 %232 = OpVectorShuffle %231 %230 4 5 6 3 
                                                      OpStore %61 %232 
                                  Input f32* %234 = OpAccessChain %137 %102 
                                         f32 %235 = OpLoad %234 
                                Uniform f32* %236 = OpAccessChain %68 %34 %102 
                                         f32 %237 = OpLoad %236 
                                         f32 %238 = OpFMul %235 %237 
                                                      OpStore %200 %238 
                                         f32 %239 = OpLoad %200 
                                       f32_3 %240 = OpCompositeConstruct %239 %239 %239 
                                       f32_4 %241 = OpLoad %61 
                                       f32_3 %242 = OpVectorShuffle %241 %241 1 0 2 
                                       f32_3 %243 = OpFMul %240 %242 
                                       f32_4 %244 = OpLoad %61 
                                       f32_4 %245 = OpVectorShuffle %244 %243 4 5 6 3 
                                                      OpStore %61 %245 
                                Private f32* %247 = OpAccessChain %61 %166 
                                         f32 %248 = OpLoad %247 
                                Private f32* %249 = OpAccessChain %246 %93 
                                                      OpStore %249 %248 
                                       f32_4 %251 = OpLoad %19 
                                       f32_3 %252 = OpVectorShuffle %251 %251 1 1 1 
                                         i32 %253 = OpLoad %10 
                              Uniform f32_4* %254 = OpAccessChain %31 %32 %253 %32 %34 
                                       f32_4 %255 = OpLoad %254 
                                       f32_3 %256 = OpVectorShuffle %255 %255 0 1 2 
                                       f32_3 %257 = OpFMul %252 %256 
                                                      OpStore %250 %257 
                                         i32 %258 = OpLoad %10 
                              Uniform f32_4* %259 = OpAccessChain %31 %32 %258 %32 %32 
                                       f32_4 %260 = OpLoad %259 
                                       f32_3 %261 = OpVectorShuffle %260 %260 0 1 2 
                                       f32_4 %262 = OpLoad %19 
                                       f32_3 %263 = OpVectorShuffle %262 %262 0 0 0 
                                       f32_3 %264 = OpFMul %261 %263 
                                       f32_3 %265 = OpLoad %250 
                                       f32_3 %266 = OpFAdd %264 %265 
                                                      OpStore %250 %266 
                                         i32 %267 = OpLoad %10 
                              Uniform f32_4* %268 = OpAccessChain %31 %32 %267 %32 %48 
                                       f32_4 %269 = OpLoad %268 
                                       f32_3 %270 = OpVectorShuffle %269 %269 0 1 2 
                                       f32_4 %271 = OpLoad %19 
                                       f32_3 %272 = OpVectorShuffle %271 %271 2 2 2 
                                       f32_3 %273 = OpFMul %270 %272 
                                       f32_3 %274 = OpLoad %250 
                                       f32_3 %275 = OpFAdd %273 %274 
                                                      OpStore %250 %275 
                                         i32 %276 = OpLoad %10 
                              Uniform f32_4* %277 = OpAccessChain %31 %32 %276 %32 %12 
                                       f32_4 %278 = OpLoad %277 
                                       f32_3 %279 = OpVectorShuffle %278 %278 0 1 2 
                                       f32_4 %280 = OpLoad %19 
                                       f32_3 %281 = OpVectorShuffle %280 %280 3 3 3 
                                       f32_3 %282 = OpFMul %279 %281 
                                       f32_3 %283 = OpLoad %250 
                                       f32_3 %284 = OpFAdd %282 %283 
                                                      OpStore %250 %284 
                                       f32_3 %285 = OpLoad %250 
                                       f32_3 %286 = OpFNegate %285 
                              Uniform f32_3* %288 = OpAccessChain %68 %32 
                                       f32_3 %289 = OpLoad %288 
                                       f32_3 %290 = OpFAdd %286 %289 
                                                      OpStore %250 %290 
                                       f32_3 %292 = OpLoad %250 
                                       f32_3 %293 = OpLoad %250 
                                         f32 %294 = OpDot %292 %293 
                                                      OpStore %291 %294 
                                         f32 %295 = OpLoad %291 
                                         f32 %296 = OpExtInst %1 32 %295 
                                                      OpStore %291 %296 
                                         f32 %297 = OpLoad %291 
                                       f32_3 %298 = OpCompositeConstruct %297 %297 %297 
                                       f32_3 %299 = OpLoad %250 
                                       f32_3 %300 = OpFMul %298 %299 
                                                      OpStore %250 %300 
                                Private f32* %301 = OpAccessChain %136 %93 
                                         f32 %302 = OpLoad %301 
                                Private f32* %303 = OpAccessChain %246 %166 
                                                      OpStore %303 %302 
                                Private f32* %304 = OpAccessChain %17 %107 
                                         f32 %305 = OpLoad %304 
                                Private f32* %306 = OpAccessChain %246 %107 
                                                      OpStore %306 %305 
                                       f32_3 %307 = OpLoad %246 
                                       f32_3 %308 = OpLoad %250 
                                       f32_3 %309 = OpVectorShuffle %308 %308 1 1 1 
                                       f32_3 %310 = OpFMul %307 %309 
                                                      OpStore %246 %310 
                                Private f32* %311 = OpAccessChain %61 %107 
                                         f32 %312 = OpLoad %311 
                                Private f32* %313 = OpAccessChain %136 %93 
                                                      OpStore %313 %312 
                                Private f32* %314 = OpAccessChain %136 %107 
                                         f32 %315 = OpLoad %314 
                                Private f32* %316 = OpAccessChain %61 %166 
                                                      OpStore %316 %315 
                                Private f32* %317 = OpAccessChain %17 %93 
                                         f32 %318 = OpLoad %317 
                                Private f32* %319 = OpAccessChain %61 %107 
                                                      OpStore %319 %318 
                                Private f32* %320 = OpAccessChain %17 %166 
                                         f32 %321 = OpLoad %320 
                                Private f32* %322 = OpAccessChain %136 %107 
                                                      OpStore %322 %321 
                                       f32_4 %323 = OpLoad %61 
                                       f32_3 %324 = OpVectorShuffle %323 %323 0 1 2 
                                       f32_3 %325 = OpLoad %250 
                                       f32_3 %326 = OpVectorShuffle %325 %325 0 0 0 
                                       f32_3 %327 = OpFMul %324 %326 
                                       f32_3 %328 = OpLoad %246 
                                       f32_3 %329 = OpFAdd %327 %328 
                                       f32_4 %330 = OpLoad %17 
                                       f32_4 %331 = OpVectorShuffle %330 %329 4 5 6 3 
                                                      OpStore %17 %331 
                                       f32_3 %333 = OpLoad %136 
                                       f32_3 %334 = OpLoad %250 
                                       f32_3 %335 = OpVectorShuffle %334 %334 2 2 2 
                                       f32_3 %336 = OpFMul %333 %335 
                                       f32_4 %337 = OpLoad %17 
                                       f32_3 %338 = OpVectorShuffle %337 %337 0 1 2 
                                       f32_3 %339 = OpFAdd %336 %338 
                                       f32_4 %340 = OpLoad %332 
                                       f32_4 %341 = OpVectorShuffle %340 %339 4 5 6 3 
                                                      OpStore %332 %341 
                                 Output f32* %343 = OpAccessChain %332 %102 
                                                      OpStore %343 %342 
                                 Output f32* %344 = OpAccessChain %97 %32 %93 
                                         f32 %345 = OpLoad %344 
                                         f32 %346 = OpFNegate %345 
                                 Output f32* %347 = OpAccessChain %97 %32 %93 
                                                      OpStore %347 %346 
                                                      OpReturn
                                                      OpFunctionEnd
; SPIR-V
; Version: 1.0
; Generator: Khronos Glslang Reference Front End; 1
; Bound: 571
; Schema: 0
                                                      OpCapability Shader 
                                               %1 = OpExtInstImport "GLSL.std.450" 
                                                      OpMemoryModel Logical GLSL450 
                                                      OpEntryPoint Fragment %4 "main" %11 %44 %568 
                                                      OpExecutionMode %4 OriginUpperLeft 
                                                      OpDecorate %11 Location 11 
                                                      OpMemberDecorate %15 0 Offset 15 
                                                      OpMemberDecorate %15 1 Offset 15 
                                                      OpMemberDecorate %15 2 Offset 15 
                                                      OpMemberDecorate %15 3 RelaxedPrecision 
                                                      OpMemberDecorate %15 3 Offset 15 
                                                      OpMemberDecorate %15 4 RelaxedPrecision 
                                                      OpMemberDecorate %15 4 Offset 15 
                                                      OpMemberDecorate %15 5 Offset 15 
                                                      OpMemberDecorate %15 6 Offset 15 
                                                      OpMemberDecorate %15 7 Offset 15 
                                                      OpMemberDecorate %15 8 Offset 15 
                                                      OpMemberDecorate %15 9 Offset 15 
                                                      OpMemberDecorate %15 10 Offset 15 
                                                      OpMemberDecorate %15 11 Offset 15 
                                                      OpMemberDecorate %15 12 Offset 15 
                                                      OpMemberDecorate %15 13 Offset 15 
                                                      OpMemberDecorate %15 14 Offset 15 
                                                      OpMemberDecorate %15 15 Offset 15 
                                                      OpMemberDecorate %15 16 Offset 15 
                                                      OpMemberDecorate %15 17 Offset 15 
                                                      OpMemberDecorate %15 18 Offset 15 
                                                      OpMemberDecorate %15 19 Offset 15 
                                                      OpMemberDecorate %15 20 Offset 15 
                                                      OpMemberDecorate %15 21 Offset 15 
                                                      OpMemberDecorate %15 22 Offset 15 
                                                      OpMemberDecorate %15 23 Offset 15 
                                                      OpMemberDecorate %15 24 Offset 15 
                                                      OpMemberDecorate %15 25 Offset 15 
                                                      OpMemberDecorate %15 26 Offset 15 
                                                      OpMemberDecorate %15 27 Offset 15 
                                                      OpMemberDecorate %15 28 Offset 15 
                                                      OpMemberDecorate %15 29 RelaxedPrecision 
                                                      OpMemberDecorate %15 29 Offset 15 
                                                      OpMemberDecorate %15 30 RelaxedPrecision 
                                                      OpMemberDecorate %15 30 Offset 15 
                                                      OpDecorate %15 Block 
                                                      OpDecorate %17 DescriptorSet 17 
                                                      OpDecorate %17 Binding 17 
                                                      OpDecorate %44 Location 44 
                                                      OpDecorate %76 RelaxedPrecision 
                                                      OpDecorate %80 RelaxedPrecision 
                                                      OpDecorate %80 DescriptorSet 80 
                                                      OpDecorate %80 Binding 80 
                                                      OpDecorate %81 RelaxedPrecision 
                                                      OpDecorate %85 RelaxedPrecision 
                                                      OpDecorate %86 RelaxedPrecision 
                                                      OpDecorate %106 RelaxedPrecision 
                                                      OpDecorate %109 RelaxedPrecision 
                                                      OpDecorate %110 RelaxedPrecision 
                                                      OpDecorate %114 RelaxedPrecision 
                                                      OpDecorate %120 RelaxedPrecision 
                                                      OpDecorate %122 RelaxedPrecision 
                                                      OpDecorate %147 RelaxedPrecision 
                                                      OpDecorate %148 RelaxedPrecision 
                                                      OpDecorate %148 DescriptorSet 148 
                                                      OpDecorate %148 Binding 148 
                                                      OpDecorate %149 RelaxedPrecision 
                                                      OpDecorate %153 RelaxedPrecision 
                                                      OpDecorate %167 RelaxedPrecision 
                                                      OpDecorate %169 RelaxedPrecision 
                                                      OpDecorate %177 RelaxedPrecision 
                                                      OpDecorate %191 RelaxedPrecision 
                                                      OpDecorate %192 RelaxedPrecision 
                                                      OpDecorate %192 DescriptorSet 192 
                                                      OpDecorate %192 Binding 192 
                                                      OpDecorate %193 RelaxedPrecision 
                                                      OpDecorate %196 RelaxedPrecision 
                                                      OpDecorate %197 RelaxedPrecision 
                                                      OpDecorate %218 RelaxedPrecision 
                                                      OpDecorate %220 RelaxedPrecision 
                                                      OpDecorate %231 RelaxedPrecision 
                                                      OpDecorate %247 RelaxedPrecision 
                                                      OpDecorate %247 DescriptorSet 247 
                                                      OpDecorate %247 Binding 247 
                                                      OpDecorate %248 RelaxedPrecision 
                                                      OpDecorate %252 RelaxedPrecision 
                                                      OpDecorate %268 RelaxedPrecision 
                                                      OpDecorate %270 RelaxedPrecision 
                                                      OpDecorate %281 RelaxedPrecision 
                                                      OpDecorate %282 RelaxedPrecision 
                                                      OpDecorate %282 DescriptorSet 282 
                                                      OpDecorate %282 Binding 282 
                                                      OpDecorate %283 RelaxedPrecision 
                                                      OpDecorate %287 RelaxedPrecision 
                                                      OpDecorate %288 RelaxedPrecision 
                                                      OpDecorate %304 RelaxedPrecision 
                                                      OpDecorate %311 RelaxedPrecision 
                                                      OpDecorate %347 RelaxedPrecision 
                                                      OpDecorate %349 RelaxedPrecision 
                                                      OpDecorate %368 RelaxedPrecision 
                                                      OpDecorate %368 DescriptorSet 368 
                                                      OpDecorate %368 Binding 368 
                                                      OpDecorate %369 RelaxedPrecision 
                                                      OpDecorate %372 RelaxedPrecision 
                                                      OpDecorate %373 RelaxedPrecision 
                                                      OpDecorate %463 RelaxedPrecision 
                                                      OpDecorate %464 RelaxedPrecision 
                                                      OpDecorate %464 DescriptorSet 464 
                                                      OpDecorate %464 Binding 464 
                                                      OpDecorate %465 RelaxedPrecision 
                                                      OpDecorate %469 RelaxedPrecision 
                                                      OpDecorate %470 RelaxedPrecision 
                                                      OpDecorate %500 RelaxedPrecision 
                                                      OpDecorate %501 RelaxedPrecision 
                                                      OpDecorate %501 DescriptorSet 501 
                                                      OpDecorate %501 Binding 501 
                                                      OpDecorate %502 RelaxedPrecision 
                                                      OpDecorate %506 RelaxedPrecision 
                                                      OpDecorate %507 RelaxedPrecision 
                                                      OpDecorate %549 RelaxedPrecision 
                                                      OpDecorate %553 RelaxedPrecision 
                                                      OpDecorate %568 RelaxedPrecision 
                                                      OpDecorate %568 Location 568 
                                               %2 = OpTypeVoid 
                                               %3 = OpTypeFunction %2 
                                               %6 = OpTypeFloat 32 
                                               %7 = OpTypeVector %6 4 
                                               %8 = OpTypePointer Private %7 
                                Private f32_4* %9 = OpVariable Private 
                                              %10 = OpTypePointer Input %7 
                                 Input f32_4* %11 = OpVariable Input 
                                              %12 = OpTypeVector %6 2 
                                              %15 = OpTypeStruct %7 %7 %7 %6 %6 %6 %6 %6 %7 %7 %6 %6 %7 %6 %6 %7 %6 %7 %6 %7 %6 %6 %7 %6 %7 %6 %7 %6 %6 %6 %6 
                                              %16 = OpTypePointer Uniform %15 
Uniform struct {f32_4; f32_4; f32_4; f32; f32; f32; f32; f32; f32_4; f32_4; f32; f32; f32_4; f32; f32; f32_4; f32; f32_4; f32; f32_4; f32; f32; f32_4; f32; f32_4; f32; f32_4; f32; f32; f32; f32;}* %17 = OpVariable Uniform 
                                              %18 = OpTypeInt 32 1 
                                          i32 %19 = OpConstant 17 
                                              %20 = OpTypePointer Uniform %7 
                                              %31 = OpTypePointer Private %12 
                               Private f32_2* %32 = OpVariable Private 
                                          i32 %33 = OpConstant 18 
                                              %34 = OpTypePointer Uniform %6 
                                          f32 %37 = OpConstant 3.674022E-40 
                                              %39 = OpTypeInt 32 0 
                                          u32 %40 = OpConstant 0 
                                              %41 = OpTypePointer Private %6 
                                 Private f32* %43 = OpVariable Private 
                                 Input f32_4* %44 = OpVariable Input 
                                              %45 = OpTypeVector %6 3 
                                              %53 = OpTypePointer Private %45 
                               Private f32_3* %54 = OpVariable Private 
                                          f32 %68 = OpConstant 3.674022E-40 
                                        f32_2 %69 = OpConstantComposite %68 %68 
                                 Private f32* %76 = OpVariable Private 
                                              %77 = OpTypeImage %6 Dim2D 0 0 0 1 Unknown 
                                              %78 = OpTypeSampledImage %77 
                                              %79 = OpTypePointer UniformConstant %78 
  UniformConstant read_only Texture2DSampled* %80 = OpVariable UniformConstant 
                                          i32 %87 = OpConstant 16 
                               Private f32_3* %92 = OpVariable Private 
                                          i32 %95 = OpConstant 9 
                                Private f32* %106 = OpVariable Private 
                                         i32 %107 = OpConstant 3 
                              Private f32_2* %111 = OpVariable Private 
                                         i32 %118 = OpConstant 4 
                                         i32 %133 = OpConstant 0 
                                         i32 %137 = OpConstant 10 
                                Private f32* %147 = OpVariable Private 
 UniformConstant read_only Texture2DSampled* %148 = OpVariable UniformConstant 
                                         i32 %156 = OpConstant 8 
                                         i32 %179 = OpConstant 11 
                                Private f32* %191 = OpVariable Private 
 UniformConstant read_only Texture2DSampled* %192 = OpVariable UniformConstant 
                              Private f32_3* %202 = OpVariable Private 
                                         i32 %205 = OpConstant 15 
 UniformConstant read_only Texture2DSampled* %247 = OpVariable UniformConstant 
                                         i32 %255 = OpConstant 12 
                                Private f32* %281 = OpVariable Private 
 UniformConstant read_only Texture2DSampled* %282 = OpVariable UniformConstant 
                                         i32 %289 = OpConstant 13 
                                         i32 %294 = OpConstant 14 
                                         f32 %299 = OpConstant 3.674022E-40 
                                         f32 %300 = OpConstant 3.674022E-40 
                                         i32 %327 = OpConstant 21 
                                         i32 %334 = OpConstant 2 
                                         i32 %361 = OpConstant 5 
 UniformConstant read_only Texture2DSampled* %368 = OpVariable UniformConstant 
                                         i32 %374 = OpConstant 6 
                                         i32 %380 = OpConstant 1 
                                         i32 %386 = OpConstant 7 
                              Private f32_3* %406 = OpVariable Private 
                                         i32 %407 = OpConstant 19 
                                         i32 %411 = OpConstant 20 
                                         i32 %424 = OpConstant 22 
                                         i32 %433 = OpConstant 25 
                                         i32 %447 = OpConstant 24 
                                Private f32* %463 = OpVariable Private 
 UniformConstant read_only Texture2DSampled* %464 = OpVariable UniformConstant 
                                         i32 %471 = OpConstant 23 
                                         i32 %478 = OpConstant 26 
                                         u32 %489 = OpConstant 1 
                                         i32 %492 = OpConstant 27 
                              Private f32_3* %500 = OpVariable Private 
 UniformConstant read_only Texture2DSampled* %501 = OpVariable UniformConstant 
                                         i32 %529 = OpConstant 28 
                                             %544 = OpTypePointer Input %6 
                                         i32 %547 = OpConstant 29 
                                         i32 %551 = OpConstant 30 
                                         u32 %561 = OpConstant 3 
                                             %567 = OpTypePointer Output %7 
                               Output f32_4* %568 = OpVariable Output 
                                          void %4 = OpFunction None %3 
                                               %5 = OpLabel 
                                        f32_4 %13 = OpLoad %11 
                                        f32_2 %14 = OpVectorShuffle %13 %13 0 1 
                               Uniform f32_4* %21 = OpAccessChain %17 %19 
                                        f32_4 %22 = OpLoad %21 
                                        f32_2 %23 = OpVectorShuffle %22 %22 0 1 
                                        f32_2 %24 = OpFMul %14 %23 
                               Uniform f32_4* %25 = OpAccessChain %17 %19 
                                        f32_4 %26 = OpLoad %25 
                                        f32_2 %27 = OpVectorShuffle %26 %26 2 3 
                                        f32_2 %28 = OpFAdd %24 %27 
                                        f32_4 %29 = OpLoad %9 
                                        f32_4 %30 = OpVectorShuffle %29 %28 4 5 2 3 
                                                      OpStore %9 %30 
                                 Uniform f32* %35 = OpAccessChain %17 %33 
                                          f32 %36 = OpLoad %35 
                                          f32 %38 = OpFAdd %36 %37 
                                 Private f32* %42 = OpAccessChain %32 %40 
                                                      OpStore %42 %38 
                                        f32_4 %46 = OpLoad %44 
                                        f32_3 %47 = OpVectorShuffle %46 %46 0 1 2 
                                        f32_4 %48 = OpLoad %44 
                                        f32_3 %49 = OpVectorShuffle %48 %48 0 1 2 
                                          f32 %50 = OpDot %47 %49 
                                                      OpStore %43 %50 
                                          f32 %51 = OpLoad %43 
                                          f32 %52 = OpExtInst %1 32 %51 
                                                      OpStore %43 %52 
                                          f32 %55 = OpLoad %43 
                                        f32_2 %56 = OpCompositeConstruct %55 %55 
                                        f32_4 %57 = OpLoad %44 
                                        f32_2 %58 = OpVectorShuffle %57 %57 0 1 
                                        f32_2 %59 = OpFMul %56 %58 
                                        f32_3 %60 = OpLoad %54 
                                        f32_3 %61 = OpVectorShuffle %60 %59 3 4 2 
                                                      OpStore %54 %61 
                                        f32_2 %62 = OpLoad %32 
                                        f32_2 %63 = OpVectorShuffle %62 %62 0 0 
                                        f32_3 %64 = OpLoad %54 
                                        f32_2 %65 = OpVectorShuffle %64 %64 0 1 
                                        f32_2 %66 = OpFMul %63 %65 
                                                      OpStore %32 %66 
                                        f32_2 %67 = OpLoad %32 
                                        f32_2 %70 = OpFMul %67 %69 
                                        f32_4 %71 = OpLoad %9 
                                        f32_2 %72 = OpVectorShuffle %71 %71 0 1 
                                        f32_2 %73 = OpFAdd %70 %72 
                                        f32_4 %74 = OpLoad %9 
                                        f32_4 %75 = OpVectorShuffle %74 %73 4 5 2 3 
                                                      OpStore %9 %75 
                   read_only Texture2DSampled %81 = OpLoad %80 
                                        f32_4 %82 = OpLoad %9 
                                        f32_2 %83 = OpVectorShuffle %82 %82 0 1 
                                        f32_4 %84 = OpImageSampleImplicitLod %81 %83 
                                          f32 %85 = OpCompositeExtract %84 0 
                                                      OpStore %76 %85 
                                          f32 %86 = OpLoad %76 
                                 Uniform f32* %88 = OpAccessChain %17 %87 
                                          f32 %89 = OpLoad %88 
                                          f32 %90 = OpFMul %86 %89 
                                 Private f32* %91 = OpAccessChain %9 %40 
                                                      OpStore %91 %90 
                                        f32_4 %93 = OpLoad %11 
                                        f32_2 %94 = OpVectorShuffle %93 %93 0 1 
                               Uniform f32_4* %96 = OpAccessChain %17 %95 
                                        f32_4 %97 = OpLoad %96 
                                        f32_2 %98 = OpVectorShuffle %97 %97 0 1 
                                        f32_2 %99 = OpFMul %94 %98 
                              Uniform f32_4* %100 = OpAccessChain %17 %95 
                                       f32_4 %101 = OpLoad %100 
                                       f32_2 %102 = OpVectorShuffle %101 %101 2 3 
                                       f32_2 %103 = OpFAdd %99 %102 
                                       f32_3 %104 = OpLoad %92 
                                       f32_3 %105 = OpVectorShuffle %104 %103 3 4 2 
                                                      OpStore %92 %105 
                                Uniform f32* %108 = OpAccessChain %17 %107 
                                         f32 %109 = OpLoad %108 
                                         f32 %110 = OpFAdd %109 %37 
                                                      OpStore %106 %110 
                                       f32_3 %112 = OpLoad %54 
                                       f32_2 %113 = OpVectorShuffle %112 %112 0 1 
                                         f32 %114 = OpLoad %106 
                                       f32_2 %115 = OpCompositeConstruct %114 %114 
                                       f32_2 %116 = OpFMul %113 %115 
                                                      OpStore %111 %116 
                                       f32_2 %117 = OpLoad %111 
                                Uniform f32* %119 = OpAccessChain %17 %118 
                                         f32 %120 = OpLoad %119 
                                Uniform f32* %121 = OpAccessChain %17 %118 
                                         f32 %122 = OpLoad %121 
                                       f32_2 %123 = OpCompositeConstruct %120 %122 
                                         f32 %124 = OpCompositeExtract %123 0 
                                         f32 %125 = OpCompositeExtract %123 1 
                                       f32_2 %126 = OpCompositeConstruct %124 %125 
                                       f32_2 %127 = OpFMul %117 %126 
                                       f32_3 %128 = OpLoad %92 
                                       f32_2 %129 = OpVectorShuffle %128 %128 0 1 
                                       f32_2 %130 = OpFAdd %127 %129 
                                       f32_3 %131 = OpLoad %92 
                                       f32_3 %132 = OpVectorShuffle %131 %130 3 4 2 
                                                      OpStore %92 %132 
                              Uniform f32_4* %134 = OpAccessChain %17 %133 
                                       f32_4 %135 = OpLoad %134 
                                       f32_2 %136 = OpVectorShuffle %135 %135 1 1 
                                Uniform f32* %138 = OpAccessChain %17 %137 
                                         f32 %139 = OpLoad %138 
                                       f32_2 %140 = OpCompositeConstruct %139 %139 
                                       f32_2 %141 = OpFMul %136 %140 
                                       f32_3 %142 = OpLoad %92 
                                       f32_2 %143 = OpVectorShuffle %142 %142 0 1 
                                       f32_2 %144 = OpFAdd %141 %143 
                                       f32_3 %145 = OpLoad %92 
                                       f32_3 %146 = OpVectorShuffle %145 %144 3 4 2 
                                                      OpStore %92 %146 
                  read_only Texture2DSampled %149 = OpLoad %148 
                                       f32_3 %150 = OpLoad %92 
                                       f32_2 %151 = OpVectorShuffle %150 %150 0 1 
                                       f32_4 %152 = OpImageSampleImplicitLod %149 %151 
                                         f32 %153 = OpCompositeExtract %152 0 
                                                      OpStore %147 %153 
                                       f32_4 %154 = OpLoad %11 
                                       f32_2 %155 = OpVectorShuffle %154 %154 0 1 
                              Uniform f32_4* %157 = OpAccessChain %17 %156 
                                       f32_4 %158 = OpLoad %157 
                                       f32_2 %159 = OpVectorShuffle %158 %158 0 1 
                                       f32_2 %160 = OpFMul %155 %159 
                              Uniform f32_4* %161 = OpAccessChain %17 %156 
                                       f32_4 %162 = OpLoad %161 
                                       f32_2 %163 = OpVectorShuffle %162 %162 2 3 
                                       f32_2 %164 = OpFAdd %160 %163 
                                                      OpStore %32 %164 
                                       f32_2 %165 = OpLoad %111 
                                Uniform f32* %166 = OpAccessChain %17 %118 
                                         f32 %167 = OpLoad %166 
                                Uniform f32* %168 = OpAccessChain %17 %118 
                                         f32 %169 = OpLoad %168 
                                       f32_2 %170 = OpCompositeConstruct %167 %169 
                                         f32 %171 = OpCompositeExtract %170 0 
                                         f32 %172 = OpCompositeExtract %170 1 
                                       f32_2 %173 = OpCompositeConstruct %171 %172 
                                       f32_2 %174 = OpFMul %165 %173 
                                       f32_2 %175 = OpLoad %32 
                                       f32_2 %176 = OpFAdd %174 %175 
                                                      OpStore %32 %176 
                                         f32 %177 = OpLoad %147 
                                       f32_2 %178 = OpCompositeConstruct %177 %177 
                                Uniform f32* %180 = OpAccessChain %17 %179 
                                         f32 %181 = OpLoad %180 
                                Uniform f32* %182 = OpAccessChain %17 %179 
                                         f32 %183 = OpLoad %182 
                                       f32_2 %184 = OpCompositeConstruct %181 %183 
                                         f32 %185 = OpCompositeExtract %184 0 
                                         f32 %186 = OpCompositeExtract %184 1 
                                       f32_2 %187 = OpCompositeConstruct %185 %186 
                                       f32_2 %188 = OpFMul %178 %187 
                                       f32_2 %189 = OpLoad %32 
                                       f32_2 %190 = OpFAdd %188 %189 
                                                      OpStore %32 %190 
                  read_only Texture2DSampled %193 = OpLoad %192 
                                       f32_2 %194 = OpLoad %32 
                                       f32_4 %195 = OpImageSampleImplicitLod %193 %194 
                                         f32 %196 = OpCompositeExtract %195 0 
                                                      OpStore %191 %196 
                                         f32 %197 = OpLoad %191 
                                Private f32* %198 = OpAccessChain %9 %40 
                                         f32 %199 = OpLoad %198 
                                         f32 %200 = OpFMul %197 %199 
                                Private f32* %201 = OpAccessChain %9 %40 
                                                      OpStore %201 %200 
                                       f32_4 %203 = OpLoad %11 
                                       f32_2 %204 = OpVectorShuffle %203 %203 0 1 
                              Uniform f32_4* %206 = OpAccessChain %17 %205 
                                       f32_4 %207 = OpLoad %206 
                                       f32_2 %208 = OpVectorShuffle %207 %207 0 1 
                                       f32_2 %209 = OpFMul %204 %208 
                              Uniform f32_4* %210 = OpAccessChain %17 %205 
                                       f32_4 %211 = OpLoad %210 
                                       f32_2 %212 = OpVectorShuffle %211 %211 2 3 
                                       f32_2 %213 = OpFAdd %209 %212 
                                       f32_3 %214 = OpLoad %202 
                                       f32_3 %215 = OpVectorShuffle %214 %213 3 4 2 
                                                      OpStore %202 %215 
                                       f32_2 %216 = OpLoad %111 
                                Uniform f32* %217 = OpAccessChain %17 %118 
                                         f32 %218 = OpLoad %217 
                                Uniform f32* %219 = OpAccessChain %17 %118 
                                         f32 %220 = OpLoad %219 
                                       f32_2 %221 = OpCompositeConstruct %218 %220 
                                         f32 %222 = OpCompositeExtract %221 0 
                                         f32 %223 = OpCompositeExtract %221 1 
                                       f32_2 %224 = OpCompositeConstruct %222 %223 
                                       f32_2 %225 = OpFMul %216 %224 
                                       f32_3 %226 = OpLoad %202 
                                       f32_2 %227 = OpVectorShuffle %226 %226 0 1 
                                       f32_2 %228 = OpFAdd %225 %227 
                                       f32_3 %229 = OpLoad %202 
                                       f32_3 %230 = OpVectorShuffle %229 %228 3 4 2 
                                                      OpStore %202 %230 
                                         f32 %231 = OpLoad %147 
                                       f32_2 %232 = OpCompositeConstruct %231 %231 
                                Uniform f32* %233 = OpAccessChain %17 %179 
                                         f32 %234 = OpLoad %233 
                                Uniform f32* %235 = OpAccessChain %17 %179 
                                         f32 %236 = OpLoad %235 
                                       f32_2 %237 = OpCompositeConstruct %234 %236 
                                         f32 %238 = OpCompositeExtract %237 0 
                                         f32 %239 = OpCompositeExtract %237 1 
                                       f32_2 %240 = OpCompositeConstruct %238 %239 
                                       f32_2 %241 = OpFMul %232 %240 
                                       f32_3 %242 = OpLoad %202 
                                       f32_2 %243 = OpVectorShuffle %242 %242 0 1 
                                       f32_2 %244 = OpFAdd %241 %243 
                                       f32_3 %245 = OpLoad %92 
                                       f32_3 %246 = OpVectorShuffle %245 %244 3 1 4 
                                                      OpStore %92 %246 
                  read_only Texture2DSampled %248 = OpLoad %247 
                                       f32_3 %249 = OpLoad %92 
                                       f32_2 %250 = OpVectorShuffle %249 %249 0 2 
                                       f32_4 %251 = OpImageSampleImplicitLod %248 %250 
                                         f32 %252 = OpCompositeExtract %251 0 
                                                      OpStore %147 %252 
                                       f32_4 %253 = OpLoad %11 
                                       f32_2 %254 = OpVectorShuffle %253 %253 0 1 
                              Uniform f32_4* %256 = OpAccessChain %17 %255 
                                       f32_4 %257 = OpLoad %256 
                                       f32_2 %258 = OpVectorShuffle %257 %257 0 1 
                                       f32_2 %259 = OpFMul %254 %258 
                              Uniform f32_4* %260 = OpAccessChain %17 %255 
                                       f32_4 %261 = OpLoad %260 
                                       f32_2 %262 = OpVectorShuffle %261 %261 2 3 
                                       f32_2 %263 = OpFAdd %259 %262 
                                       f32_3 %264 = OpLoad %202 
                                       f32_3 %265 = OpVectorShuffle %264 %263 3 4 2 
                                                      OpStore %202 %265 
                                       f32_2 %266 = OpLoad %111 
                                Uniform f32* %267 = OpAccessChain %17 %118 
                                         f32 %268 = OpLoad %267 
                                Uniform f32* %269 = OpAccessChain %17 %118 
                                         f32 %270 = OpLoad %269 
                                       f32_2 %271 = OpCompositeConstruct %268 %270 
                                         f32 %272 = OpCompositeExtract %271 0 
                                         f32 %273 = OpCompositeExtract %271 1 
                                       f32_2 %274 = OpCompositeConstruct %272 %273 
                                       f32_2 %275 = OpFMul %266 %274 
                                       f32_3 %276 = OpLoad %202 
                                       f32_2 %277 = OpVectorShuffle %276 %276 0 1 
                                       f32_2 %278 = OpFAdd %275 %277 
                                       f32_3 %279 = OpLoad %202 
                                       f32_3 %280 = OpVectorShuffle %279 %278 3 4 2 
                                                      OpStore %202 %280 
                  read_only Texture2DSampled %283 = OpLoad %282 
                                       f32_3 %284 = OpLoad %202 
                                       f32_2 %285 = OpVectorShuffle %284 %284 0 1 
                                       f32_4 %286 = OpImageSampleImplicitLod %283 %285 
                                         f32 %287 = OpCompositeExtract %286 0 
                                                      OpStore %281 %287 
                                         f32 %288 = OpLoad %281 
                                Uniform f32* %290 = OpAccessChain %17 %289 
                                         f32 %291 = OpLoad %290 
                                         f32 %292 = OpFAdd %288 %291 
                                                      OpStore %43 %292 
                                         f32 %293 = OpLoad %43 
                                Uniform f32* %295 = OpAccessChain %17 %294 
                                         f32 %296 = OpLoad %295 
                                         f32 %297 = OpFMul %293 %296 
                                                      OpStore %43 %297 
                                         f32 %298 = OpLoad %43 
                                         f32 %301 = OpExtInst %1 43 %298 %299 %300 
                                                      OpStore %43 %301 
                                         f32 %302 = OpLoad %43 
                                         f32 %303 = OpFAdd %302 %37 
                                                      OpStore %43 %303 
                                         f32 %304 = OpLoad %147 
                                         f32 %305 = OpLoad %43 
                                         f32 %306 = OpFMul %304 %305 
                                         f32 %307 = OpFAdd %306 %300 
                                Private f32* %308 = OpAccessChain %92 %40 
                                                      OpStore %308 %307 
                                Private f32* %309 = OpAccessChain %92 %40 
                                         f32 %310 = OpLoad %309 
                                         f32 %311 = OpLoad %191 
                                         f32 %312 = OpFMul %310 %311 
                                Private f32* %313 = OpAccessChain %32 %40 
                                                      OpStore %313 %312 
                                Private f32* %314 = OpAccessChain %92 %40 
                                         f32 %315 = OpLoad %314 
                                         f32 %316 = OpFNegate %315 
                                         f32 %317 = OpFAdd %316 %300 
                                Private f32* %318 = OpAccessChain %92 %40 
                                                      OpStore %318 %317 
                                Private f32* %319 = OpAccessChain %92 %40 
                                         f32 %320 = OpLoad %319 
                                Private f32* %321 = OpAccessChain %32 %40 
                                         f32 %322 = OpLoad %321 
                                         f32 %323 = OpFMul %320 %322 
                                Private f32* %324 = OpAccessChain %92 %40 
                                                      OpStore %324 %323 
                                Private f32* %325 = OpAccessChain %92 %40 
                                         f32 %326 = OpLoad %325 
                                Uniform f32* %328 = OpAccessChain %17 %327 
                                         f32 %329 = OpLoad %328 
                                         f32 %330 = OpFMul %326 %329 
                                Private f32* %331 = OpAccessChain %92 %40 
                                                      OpStore %331 %330 
                                       f32_4 %332 = OpLoad %11 
                                       f32_2 %333 = OpVectorShuffle %332 %332 0 1 
                              Uniform f32_4* %335 = OpAccessChain %17 %334 
                                       f32_4 %336 = OpLoad %335 
                                       f32_2 %337 = OpVectorShuffle %336 %336 0 1 
                                       f32_2 %338 = OpFMul %333 %337 
                              Uniform f32_4* %339 = OpAccessChain %17 %334 
                                       f32_4 %340 = OpLoad %339 
                                       f32_2 %341 = OpVectorShuffle %340 %340 2 3 
                                       f32_2 %342 = OpFAdd %338 %341 
                                       f32_3 %343 = OpLoad %202 
                                       f32_3 %344 = OpVectorShuffle %343 %342 3 4 2 
                                                      OpStore %202 %344 
                                       f32_2 %345 = OpLoad %111 
                                Uniform f32* %346 = OpAccessChain %17 %118 
                                         f32 %347 = OpLoad %346 
                                Uniform f32* %348 = OpAccessChain %17 %118 
                                         f32 %349 = OpLoad %348 
                                       f32_2 %350 = OpCompositeConstruct %347 %349 
                                         f32 %351 = OpCompositeExtract %350 0 
                                         f32 %352 = OpCompositeExtract %350 1 
                                       f32_2 %353 = OpCompositeConstruct %351 %352 
                                       f32_2 %354 = OpFMul %345 %353 
                                       f32_3 %355 = OpLoad %202 
                                       f32_2 %356 = OpVectorShuffle %355 %355 0 1 
                                       f32_2 %357 = OpFAdd %354 %356 
                                                      OpStore %111 %357 
                              Uniform f32_4* %358 = OpAccessChain %17 %133 
                                       f32_4 %359 = OpLoad %358 
                                       f32_2 %360 = OpVectorShuffle %359 %359 1 1 
                                Uniform f32* %362 = OpAccessChain %17 %361 
                                         f32 %363 = OpLoad %362 
                                       f32_2 %364 = OpCompositeConstruct %363 %363 
                                       f32_2 %365 = OpFMul %360 %364 
                                       f32_2 %366 = OpLoad %111 
                                       f32_2 %367 = OpFAdd %365 %366 
                                                      OpStore %111 %367 
                  read_only Texture2DSampled %369 = OpLoad %368 
                                       f32_2 %370 = OpLoad %111 
                                       f32_4 %371 = OpImageSampleImplicitLod %369 %370 
                                         f32 %372 = OpCompositeExtract %371 0 
                                                      OpStore %281 %372 
                                         f32 %373 = OpLoad %281 
                                Uniform f32* %375 = OpAccessChain %17 %374 
                                         f32 %376 = OpLoad %375 
                                         f32 %377 = OpFAdd %373 %376 
                                                      OpStore %43 %377 
                                         f32 %378 = OpLoad %43 
                                       f32_3 %379 = OpCompositeConstruct %378 %378 %378 
                              Uniform f32_4* %381 = OpAccessChain %17 %380 
                                       f32_4 %382 = OpLoad %381 
                                       f32_3 %383 = OpVectorShuffle %382 %382 0 1 2 
                                       f32_3 %384 = OpFMul %379 %383 
                                                      OpStore %202 %384 
                                       f32_3 %385 = OpLoad %202 
                                Uniform f32* %387 = OpAccessChain %17 %386 
                                         f32 %388 = OpLoad %387 
                                Uniform f32* %389 = OpAccessChain %17 %386 
                                         f32 %390 = OpLoad %389 
                                Uniform f32* %391 = OpAccessChain %17 %386 
                                         f32 %392 = OpLoad %391 
                                       f32_3 %393 = OpCompositeConstruct %388 %390 %392 
                                         f32 %394 = OpCompositeExtract %393 0 
                                         f32 %395 = OpCompositeExtract %393 1 
                                         f32 %396 = OpCompositeExtract %393 2 
                                       f32_3 %397 = OpCompositeConstruct %394 %395 %396 
                                       f32_3 %398 = OpFMul %385 %397 
                                                      OpStore %202 %398 
                                       f32_3 %399 = OpLoad %202 
                                       f32_2 %400 = OpLoad %32 
                                       f32_3 %401 = OpVectorShuffle %400 %400 0 0 0 
                                       f32_3 %402 = OpFMul %399 %401 
                                       f32_4 %403 = OpLoad %9 
                                       f32_3 %404 = OpVectorShuffle %403 %403 0 0 0 
                                       f32_3 %405 = OpFAdd %402 %404 
                                                      OpStore %202 %405 
                              Uniform f32_4* %408 = OpAccessChain %17 %407 
                                       f32_4 %409 = OpLoad %408 
                                       f32_3 %410 = OpVectorShuffle %409 %409 0 1 2 
                                Uniform f32* %412 = OpAccessChain %17 %411 
                                         f32 %413 = OpLoad %412 
                                       f32_3 %414 = OpCompositeConstruct %413 %413 %413 
                                       f32_3 %415 = OpFMul %410 %414 
                                                      OpStore %406 %415 
                                       f32_3 %416 = OpLoad %406 
                                       f32_2 %417 = OpLoad %32 
                                       f32_3 %418 = OpVectorShuffle %417 %417 0 0 0 
                                       f32_3 %419 = OpFMul %416 %418 
                                       f32_3 %420 = OpLoad %202 
                                       f32_3 %421 = OpFAdd %419 %420 
                                                      OpStore %202 %421 
                                       f32_3 %422 = OpLoad %92 
                                       f32_3 %423 = OpVectorShuffle %422 %422 0 0 0 
                              Uniform f32_4* %425 = OpAccessChain %17 %424 
                                       f32_4 %426 = OpLoad %425 
                                       f32_3 %427 = OpVectorShuffle %426 %426 0 1 2 
                                       f32_3 %428 = OpFMul %423 %427 
                                       f32_3 %429 = OpLoad %202 
                                       f32_3 %430 = OpFAdd %428 %429 
                                       f32_4 %431 = OpLoad %9 
                                       f32_4 %432 = OpVectorShuffle %431 %430 4 5 2 6 
                                                      OpStore %9 %432 
                                Uniform f32* %434 = OpAccessChain %17 %433 
                                         f32 %435 = OpLoad %434 
                                         f32 %436 = OpFAdd %435 %37 
                                Private f32* %437 = OpAccessChain %111 %40 
                                                      OpStore %437 %436 
                                       f32_3 %438 = OpLoad %54 
                                       f32_2 %439 = OpVectorShuffle %438 %438 0 1 
                                       f32_2 %440 = OpLoad %111 
                                       f32_2 %441 = OpVectorShuffle %440 %440 0 0 
                                       f32_2 %442 = OpFMul %439 %441 
                                       f32_3 %443 = OpLoad %54 
                                       f32_3 %444 = OpVectorShuffle %443 %442 3 4 2 
                                                      OpStore %54 %444 
                                       f32_4 %445 = OpLoad %11 
                                       f32_2 %446 = OpVectorShuffle %445 %445 0 1 
                              Uniform f32_4* %448 = OpAccessChain %17 %447 
                                       f32_4 %449 = OpLoad %448 
                                       f32_2 %450 = OpVectorShuffle %449 %449 0 1 
                                       f32_2 %451 = OpFMul %446 %450 
                              Uniform f32_4* %452 = OpAccessChain %17 %447 
                                       f32_4 %453 = OpLoad %452 
                                       f32_2 %454 = OpVectorShuffle %453 %453 2 3 
                                       f32_2 %455 = OpFAdd %451 %454 
                                                      OpStore %111 %455 
                                       f32_3 %456 = OpLoad %54 
                                       f32_2 %457 = OpVectorShuffle %456 %456 0 1 
                                       f32_2 %458 = OpFMul %457 %69 
                                       f32_2 %459 = OpLoad %111 
                                       f32_2 %460 = OpFAdd %458 %459 
                                       f32_3 %461 = OpLoad %54 
                                       f32_3 %462 = OpVectorShuffle %461 %460 3 4 2 
                                                      OpStore %54 %462 
                  read_only Texture2DSampled %465 = OpLoad %464 
                                       f32_3 %466 = OpLoad %54 
                                       f32_2 %467 = OpVectorShuffle %466 %466 0 1 
                                       f32_4 %468 = OpImageSampleImplicitLod %465 %467 
                                         f32 %469 = OpCompositeExtract %468 0 
                                                      OpStore %463 %469 
                                         f32 %470 = OpLoad %463 
                                Uniform f32* %472 = OpAccessChain %17 %471 
                                         f32 %473 = OpLoad %472 
                                         f32 %474 = OpFMul %470 %473 
                                Private f32* %475 = OpAccessChain %54 %40 
                                                      OpStore %475 %474 
                                       f32_4 %476 = OpLoad %11 
                                       f32_2 %477 = OpVectorShuffle %476 %476 0 1 
                              Uniform f32_4* %479 = OpAccessChain %17 %478 
                                       f32_4 %480 = OpLoad %479 
                                       f32_2 %481 = OpVectorShuffle %480 %480 0 1 
                                       f32_2 %482 = OpFMul %477 %481 
                              Uniform f32_4* %483 = OpAccessChain %17 %478 
                                       f32_4 %484 = OpLoad %483 
                                       f32_2 %485 = OpVectorShuffle %484 %484 2 3 
                                       f32_2 %486 = OpFAdd %482 %485 
                                       f32_3 %487 = OpLoad %202 
                                       f32_3 %488 = OpVectorShuffle %487 %486 0 3 4 
                                                      OpStore %202 %488 
                                Uniform f32* %490 = OpAccessChain %17 %133 %489 
                                         f32 %491 = OpLoad %490 
                                Uniform f32* %493 = OpAccessChain %17 %492 
                                         f32 %494 = OpLoad %493 
                                         f32 %495 = OpFMul %491 %494 
                                Private f32* %496 = OpAccessChain %202 %489 
                                         f32 %497 = OpLoad %496 
                                         f32 %498 = OpFAdd %495 %497 
                                Private f32* %499 = OpAccessChain %202 %40 
                                                      OpStore %499 %498 
                  read_only Texture2DSampled %502 = OpLoad %501 
                                       f32_3 %503 = OpLoad %202 
                                       f32_2 %504 = OpVectorShuffle %503 %503 0 2 
                                       f32_4 %505 = OpImageSampleImplicitLod %502 %504 
                                       f32_3 %506 = OpVectorShuffle %505 %505 0 1 2 
                                                      OpStore %500 %506 
                                       f32_3 %507 = OpLoad %500 
                                       f32_3 %508 = OpLoad %54 
                                       f32_3 %509 = OpVectorShuffle %508 %508 0 0 0 
                                       f32_3 %510 = OpFMul %507 %509 
                                                      OpStore %54 %510 
                                       f32_3 %511 = OpLoad %54 
                                       f32_2 %512 = OpLoad %32 
                                       f32_3 %513 = OpVectorShuffle %512 %512 0 0 0 
                                       f32_3 %514 = OpFMul %511 %513 
                                       f32_4 %515 = OpLoad %9 
                                       f32_3 %516 = OpVectorShuffle %515 %515 0 1 3 
                                       f32_3 %517 = OpFAdd %514 %516 
                                       f32_4 %518 = OpLoad %9 
                                       f32_4 %519 = OpVectorShuffle %518 %517 4 5 6 3 
                                                      OpStore %9 %519 
                                       f32_4 %520 = OpLoad %9 
                                       f32_3 %521 = OpVectorShuffle %520 %520 0 1 2 
                                       f32_3 %522 = OpCompositeConstruct %299 %299 %299 
                                       f32_3 %523 = OpCompositeConstruct %300 %300 %300 
                                       f32_3 %524 = OpExtInst %1 43 %521 %522 %523 
                                       f32_4 %525 = OpLoad %9 
                                       f32_4 %526 = OpVectorShuffle %525 %524 4 5 6 3 
                                                      OpStore %9 %526 
                                       f32_4 %527 = OpLoad %9 
                                       f32_3 %528 = OpVectorShuffle %527 %527 0 1 2 
                                Uniform f32* %530 = OpAccessChain %17 %529 
                                         f32 %531 = OpLoad %530 
                                Uniform f32* %532 = OpAccessChain %17 %529 
                                         f32 %533 = OpLoad %532 
                                Uniform f32* %534 = OpAccessChain %17 %529 
                                         f32 %535 = OpLoad %534 
                                       f32_3 %536 = OpCompositeConstruct %531 %533 %535 
                                         f32 %537 = OpCompositeExtract %536 0 
                                         f32 %538 = OpCompositeExtract %536 1 
                                         f32 %539 = OpCompositeExtract %536 2 
                                       f32_3 %540 = OpCompositeConstruct %537 %538 %539 
                                       f32_3 %541 = OpFMul %528 %540 
                                       f32_4 %542 = OpLoad %9 
                                       f32_4 %543 = OpVectorShuffle %542 %541 4 5 6 3 
                                                      OpStore %9 %543 
                                  Input f32* %545 = OpAccessChain %11 %489 
                                         f32 %546 = OpLoad %545 
                                Uniform f32* %548 = OpAccessChain %17 %547 
                                         f32 %549 = OpLoad %548 
                                         f32 %550 = OpFMul %546 %549 
                                Uniform f32* %552 = OpAccessChain %17 %551 
                                         f32 %553 = OpLoad %552 
                                         f32 %554 = OpFAdd %550 %553 
                                Private f32* %555 = OpAccessChain %54 %40 
                                                      OpStore %555 %554 
                                Private f32* %556 = OpAccessChain %9 %40 
                                         f32 %557 = OpLoad %556 
                                Private f32* %558 = OpAccessChain %54 %40 
                                         f32 %559 = OpLoad %558 
                                         f32 %560 = OpFMul %557 %559 
                                Private f32* %562 = OpAccessChain %9 %561 
                                                      OpStore %562 %560 
                                Private f32* %563 = OpAccessChain %9 %561 
                                         f32 %564 = OpLoad %563 
                                         f32 %565 = OpExtInst %1 43 %564 %299 %300 
                                Private f32* %566 = OpAccessChain %9 %561 
                                                      OpStore %566 %565 
                                       f32_4 %569 = OpLoad %9 
                                                      OpStore %568 %569 
                                                      OpReturn
                                                      OpFunctionEnd
"
}
}
Program "fp" {
SubProgram "d3d11 " {
"// shader disassembly not supported on DXBC"
}
SubProgram "vulkan " {
""
}
SubProgram "d3d11 " {
Keywords { "FOG_HEIGHT" }
"// shader disassembly not supported on DXBC"
}
SubProgram "vulkan " {
Keywords { "FOG_HEIGHT" }
""
}
SubProgram "d3d11 " {
Keywords { "FOG_HEIGHT" "INSTANCING_ON" }
"// shader disassembly not supported on DXBC"
}
SubProgram "vulkan " {
Keywords { "FOG_HEIGHT" "INSTANCING_ON" }
""
}
SubProgram "d3d11 " {
Keywords { "INSTANCING_ON" }
"// shader disassembly not supported on DXBC"
}
SubProgram "vulkan " {
Keywords { "INSTANCING_ON" }
""
}
}
}
}
CustomEditor "MiHoYoASEMaterialInspector"
}