//----------------------------------------------------------
// BrushImageAudrey  orig.  http://glslsandbox.com/e#30973.1
//                
// Created by inigo quilez - iq/2013 
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
// Original code: https://www.shadertoy.com/view/4df3D8
//
// These are 316 gaussian points (200 brushes by using local symmetry) forming the picture
// of Audrey Hepburn. They pack down to 800 bytes (34 bits per point) before huffman/arithmetic
// compression.
//
// The points were chosen by (very quickly) runing this 
//    http://www.iquilezles.org/www/articles/genetic/genetic.htm
// with some importance sampling for the eyes, nouse and mouth.
//----------------------------------------------------------
// Trying to use initialized array data, but seems to be slower
// because there are no possibility to use const array data...
//----------------------------------------------------------

// uncomment to animate brushes 
#define ANIMATE

#ifdef GL_ES
  precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//----------------------------------------------------------
const int NUM_DATA = 199;
vec4 brushdata[NUM_DATA];
void initData()
{
  brushdata[0] = vec4(1.000,0.371,0.379,11.770);
  brushdata[1] = vec4(0.992,0.545,0.551, 8.359);
  brushdata[2] = vec4(0.749,0.623,0.990,36.571);
  brushdata[3] = vec4(1.000,0.510,0.395,11.315);
  brushdata[4] = vec4(1.000,0.723,0.564,15.170);
  brushdata[5] = vec4(0.953,0.729,0.750,14.629);
  brushdata[6] = vec4(0.706,0.982,0.033,16.254);
  brushdata[7] = vec4(1.000,0.855,0.652,26.256);
  brushdata[8] = vec4(1.000,0.664,0.623,81.920);
  brushdata[9] = vec4(0.000,0.881,0.750, 8.031);
  brushdata[10] = vec4(0.686,0.682,0.900,27.676);
  brushdata[11] = vec4(1.000,0.189,0.684,18.618);
  brushdata[12] = vec4(0.000,0.904,0.750, 8.031);
  brushdata[13] = vec4(1.000,0.422,0.195,44.522);
  brushdata[14] = vec4(1.000,0.779,0.750,16.787);
  brushdata[15] = vec4(1.000,0.645,0.330,14.222);
  brushdata[16] = vec4(1.000,0.197,0.648,22.505);
  brushdata[17] = vec4(0.702,0.512,0.393,35.310);
  brushdata[18] = vec4(1.000,0.744,0.621,14.949);
  brushdata[19] = vec4(0.671,0.885,0.092,24.675);
  brushdata[20] = vec4(0.000,0.344,0.750, 8.031);
  brushdata[21] = vec4(1.000,0.760,0.465,40.960);
  brushdata[22] = vec4(0.008,0.908,0.311, 8.031);
  brushdata[23] = vec4(0.016,0.959,0.750,10.039);
  brushdata[24] = vec4(0.004,0.930,0.750,12.800);
  brushdata[25] = vec4(1.000,0.555,0.250,19.883);
  brushdata[26] = vec4(1.000,0.770,1.018,15.876);
  brushdata[27] = vec4(0.000,0.828,0.756,36.571);
  brushdata[28] = vec4(0.580,0.566,0.424,89.043);
  brushdata[29] = vec4(0.988,0.162,0.691,40.157);
  brushdata[30] = vec4(0.000,0.314,0.750, 8.031);
  brushdata[31] = vec4(0.000,0.947,0.125,32.000);
  brushdata[32] = vec4(0.914,0.844,0.725,52.513);
  brushdata[33] = vec4(1.000,0.313,0.762,42.667);
  brushdata[34] = vec4(0.996,0.676,0.689,85.333);
  brushdata[35] = vec4(0.980,0.346,0.559,24.675);
  brushdata[36] = vec4(1.000,0.553,0.250,18.789);
  brushdata[37] = vec4(0.004,0.258,0.248, 8.031);
  brushdata[38] = vec4(1.000,0.420,0.742,30.567);
  brushdata[39] = vec4(0.906,0.543,0.250,22.756);
  brushdata[40] = vec4(0.863,0.674,0.322,20.078);
  brushdata[41] = vec4(0.753,0.357,0.686,78.769);
  brushdata[42] = vec4(0.906,0.795,0.705,37.236);
  brushdata[43] = vec4(0.933,0.520,0.365,38.642);
  brushdata[44] = vec4(0.996,0.318,0.488,14.734);
  brushdata[45] = vec4(0.337,0.486,0.281,81.920);
  brushdata[46] = vec4(0.965,0.691,0.516,16.650);
  brushdata[47] = vec4(0.808,0.582,0.973,52.513);
  brushdata[48] = vec4(0.012,0.240,0.928, 8.063);
  brushdata[49] = vec4(1.000,0.496,0.217,31.508);
  brushdata[50] = vec4(0.000,0.658,0.953,34.133);
  brushdata[51] = vec4(0.871,0.582,0.172,62.061);
  brushdata[52] = vec4(0.855,0.346,0.342,17.504);
  brushdata[53] = vec4(0.878,0.787,0.648,28.845);
  brushdata[54] = vec4(0.000,0.984,0.111,35.310);
  brushdata[55] = vec4(0.855,0.514,0.965,66.065);
  brushdata[56] = vec4(0.561,0.613,0.350,81.920);
  brushdata[57] = vec4(0.992,0.818,0.902,21.558);
  brushdata[58] = vec4(0.914,0.746,0.615,40.157);
  brushdata[59] = vec4(0.557,0.580,0.125,60.235);
  brushdata[60] = vec4(0.475,0.547,0.414,70.621);
  brushdata[61] = vec4(0.843,0.680,0.793,20.277);
  brushdata[62] = vec4(1.000,0.230,0.758,56.889);
  brushdata[63] = vec4(1.000,0.299,0.691,68.267);
  brushdata[64] = vec4(0.737,0.518,0.100,68.267);
  brushdata[65] = vec4(0.996,0.227,0.514,41.796);
  brushdata[66] = vec4(0.929,0.850,0.770,62.061);
  brushdata[67] = vec4(0.682,0.834,0.111,30.118);
  brushdata[68] = vec4(0.996,0.854,0.793,58.514);
  brushdata[69] = vec4(0.490,0.736,0.889,19.321);
  brushdata[70] = vec4(0.980,0.465,0.725,16.126);
  brushdata[71] = vec4(0.992,0.484,1.010,23.273);
  brushdata[72] = vec4(0.008,0.949,0.727,23.540);
  brushdata[73] = vec4(0.012,0.086,0.086, 8.031);
  brushdata[74] = vec4(1.000,0.121,0.750,44.522);
  brushdata[75] = vec4(0.427,0.617,0.891,27.676);
  brushdata[76] = vec4(0.804,0.693,0.633,78.769);
  brushdata[77] = vec4(0.012,0.711,0.084,13.745);
  brushdata[78] = vec4(0.082,0.584,0.338,107.789);
  brushdata[79] = vec4(0.929,0.613,0.268,19.692);
  brushdata[80] = vec4(0.200,0.549,0.420,128.00);
  brushdata[81] = vec4(1.000,0.402,0.717,26.947);
  brushdata[82] = vec4(0.000,0.551,0.168,45.511);
  brushdata[83] = vec4(0.992,0.627,0.621,56.889);
  brushdata[84] = vec4(0.902,0.361,0.748,40.960);
  brushdata[85] = vec4(0.984,0.344,0.754,38.642);
  brushdata[86] = vec4(0.902,0.203,0.818,51.200);
  brushdata[87] = vec4(1.000,0.230,0.803,52.513);
  brushdata[88] = vec4(0.922,0.738,0.691,47.628);
  brushdata[89] = vec4(0.000,0.385,0.797,43.574);
  brushdata[90] = vec4(0.000,0.725,0.305,62.061);
  brushdata[91] = vec4(0.000,0.150,0.750,45.511);
  brushdata[92] = vec4(1.000,0.742,0.408,47.628);
  brushdata[93] = vec4(0.000,0.645,0.643,60.235);
  brushdata[94] = vec4(1.000,0.645,0.438,35.310);
  brushdata[95] = vec4(0.510,0.564,0.789,18.450);
  brushdata[96] = vec4(0.863,0.211,0.781,30.567);
  brushdata[97] = vec4(0.106,0.508,0.328,89.043);
  brushdata[98] = vec4(0.012,0.410,0.875,14.629);
  brushdata[99] = vec4(1.000,0.871,0.877,48.762);
  brushdata[100] = vec4(1.000,0.258,0.779,37.926);
  brushdata[101] = vec4(0.000,0.436,0.807,28.845);
  brushdata[102] = vec4(0.918,0.861,0.836,49.951);
  brushdata[103] = vec4(1.000,0.291,0.770,40.960);
  brushdata[104] = vec4(0.000,0.750,0.283,27.676);
  brushdata[105] = vec4(0.965,0.596,0.572,28.055);
  brushdata[106] = vec4(0.902,0.803,0.953,24.976);
  brushdata[107] = vec4(0.957,0.498,0.600,16.126);
  brushdata[108] = vec4(0.914,0.322,0.432,15.634);
  brushdata[109] = vec4(0.008,0.025,0.621,17.809);
  brushdata[110] = vec4(0.000,0.916,0.713,56.889);
  brushdata[111] = vec4(0.914,0.547,0.971,47.628);
  brushdata[112] = vec4(0.000,0.207,0.432,37.926);
  brushdata[113] = vec4(0.875,0.176,0.793,46.545);
  brushdata[114] = vec4(0.000,0.646,0.668,41.796);
  brushdata[115] = vec4(1.000,0.721,0.691,51.200);
  brushdata[116] = vec4(0.451,0.559,0.754,49.951);
  brushdata[117] = vec4(0.969,0.846,0.750,58.514);
  brushdata[118] = vec4(0.000,0.900,0.146,36.571);
  brushdata[119] = vec4(1.000,0.613,0.635,85.333);
  brushdata[120] = vec4(0.596,0.807,0.150,58.514);
  brushdata[121] = vec4(0.898,0.330,0.760,40.157);
  brushdata[122] = vec4(0.694,0.594,0.012,51.200);
  brushdata[123] = vec4(0.698,0.592,0.055,53.895);
  brushdata[124] = vec4(0.902,0.268,0.773,39.385);
  brushdata[125] = vec4(0.925,0.838,0.660,58.514);
  brushdata[126] = vec4(0.843,0.670,0.242,28.444);
  brushdata[127] = vec4(0.243,0.465,0.285,85.333);
  brushdata[128] = vec4(0.816,0.588,0.674,44.522);
  brushdata[129] = vec4(0.008,0.283,0.115, 8.031);
  brushdata[130] = vec4(0.247,0.414,0.691,60.235);
  brushdata[131] = vec4(1.000,0.104,0.781,60.235);
  brushdata[132] = vec4(0.000,0.619,0.660,60.235);
  brushdata[133] = vec4(0.584,0.650,0.994,46.545);
  brushdata[134] = vec4(0.000,0.219,0.393,36.571);
  brushdata[135] = vec4(1.000,0.307,0.645,97.524);
  brushdata[136] = vec4(0.953,0.639,0.771,38.642);
  brushdata[137] = vec4(0.000,0.238,0.357,34.712);
  brushdata[138] = vec4(0.922,0.713,0.352,53.895);
  brushdata[139] = vec4(0.965,0.387,0.748,43.574);
  brushdata[140] = vec4(0.000,0.898,0.633,41.796);
  brushdata[141] = vec4(0.941,0.352,0.488,14.734);
  brushdata[142] = vec4(0.933,0.439,0.725,30.567);
  brushdata[143] = vec4(0.310,0.541,0.906,47.628);
  brushdata[144] = vec4(0.941,0.502,0.689,24.094);
  brushdata[145] = vec4(0.094,0.527,0.330,85.333);
  brushdata[146] = vec4(0.000,0.090,0.688,55.351);
  brushdata[147] = vec4(0.000,0.652,0.713,75.852);
  brushdata[148] = vec4(0.949,0.320,0.623,107.789);
  brushdata[149] = vec4(0.890,0.775,0.750,22.505);
  brushdata[150] = vec4(0.012,0.918,0.490,14.322);
  brushdata[151] = vec4(1.000,0.871,0.967,58.514);
  brushdata[152] = vec4(0.000,0.324,0.676,64.000);
  brushdata[153] = vec4(0.008,0.141,0.248, 8.031);
  brushdata[154] = vec4(0.000,0.633,0.707,75.852);
  brushdata[155] = vec4(0.910,0.385,0.207,44.522);
  brushdata[156] = vec4(0.012,0.703,0.182,31.508);
  brushdata[157] = vec4(0.000,0.617,0.703,73.143);
  brushdata[158] = vec4(0.890,0.352,0.225,45.511);
  brushdata[159] = vec4(0.933,0.826,0.604,44.522);
  brushdata[160] = vec4(0.914,0.777,0.574,25.924);
  brushdata[161] = vec4(0.631,0.781,0.182,68.267);
  brushdata[162] = vec4(1.000,0.873,0.916,48.762);
  brushdata[163] = vec4(0.694,0.520,0.113,81.920);
  brushdata[164] = vec4(0.000,0.900,0.926,58.514);
  brushdata[165] = vec4(0.184,0.598,0.344,146.286);
  brushdata[166] = vec4(0.863,0.678,0.250,35.310);
  brushdata[167] = vec4(0.090,0.566,0.332,78.769);
  brushdata[168] = vec4(0.420,0.445,0.301,56.889);
  brushdata[169] = vec4(0.973,0.617,0.516,18.124);
  brushdata[170] = vec4(0.000,0.191,0.500,39.385);
  brushdata[171] = vec4(0.000,0.240,0.326,31.508);
  brushdata[172] = vec4(0.000,0.264,0.322,55.351);
  brushdata[173] = vec4(0.000,0.604,0.699,70.621);
  brushdata[174] = vec4(0.000,0.113,0.604,43.574);
  brushdata[175] = vec4(0.894,0.760,0.697,49.951);
  brushdata[176] = vec4(0.914,0.725,0.383,55.351);
  brushdata[177] = vec4(0.000,0.199,0.467,48.762);
  brushdata[178] = vec4(0.000,0.904,0.660,52.513);
  brushdata[179] = vec4(0.922,0.611,0.191,45.511);
  brushdata[180] = vec4(0.059,0.789,0.869,30.118);
  brushdata[181] = vec4(0.976,0.641,0.213,40.960);
  brushdata[182] = vec4(0.918,0.402,0.742,47.628);
  brushdata[183] = vec4(0.945,0.717,0.582,40.157);
  brushdata[184] = vec4(0.000,0.299,0.672,58.514);
  brushdata[185] = vec4(0.000,0.719,0.666,48.762);
  brushdata[186] = vec4(0.882,0.697,0.271,58.514);
  brushdata[187] = vec4(0.929,0.752,0.436,64.000);
  brushdata[188] = vec4(1.000,0.867,0.813,56.889);
  brushdata[189] = vec4(0.643,0.588,0.090,64.000);
  brushdata[190] = vec4(0.012,0.063,0.922,10.952);
  brushdata[191] = vec4(0.878,0.186,0.750,31.508);
  brushdata[192] = vec4(0.953,0.648,0.613,120.471);
  brushdata[193] = vec4(0.973,0.180,0.576,45.511);
  brushdata[194] = vec4(0.741,0.943,0.076,52.513);
  brushdata[195] = vec4(0.059,0.545,0.332,89.043);
  brushdata[196] = vec4(0.094,0.295,0.734,85.333);
  brushdata[197] = vec4(0.008,0.676,0.721,85.333);
  brushdata[198] = vec4(0.550,0.350,0.650,85.000);
}              
//----------------------------------------------------------
float col = 0.0;   // current pixel color value 
float ani = smoothstep( 0.1, 4.0, +cos(time)*sin(time*1.57)*tan(time) );

//----------------------------------------------------------
// brush drawing input:
//  col:  current pixel color 
//  pos:  current pixel position
//   br:  brush data: x   brush gray scaled color
//                    yz  brush center
//                    w   brush size
//  ani:  animation distance (0.0 .. 1.0)
//----------------------------------------------------------
void brush (in vec2 pos)
{
  vec2 dd = pos;
  float brw = 0.0;
  for (int i=0; i<NUM_DATA; i++)
  {
    vec4 br = brushdata[i];
    #ifdef ANIMATE
      pos += 0.5*ani*cos(time + 8.0*br.yz); 
    #endif
				
    dd = pos - br.yz;       // brush distance vector
    brw = br.w * -br.w;     // negated squared brush size
    // add color depending on brush color, size and distance 
    col = mix(col, br.x, exp(brw*dot(dd,dd)));
    if (abs(br.z - 0.5) < 0.251)  // draw left mirror point ?
    {
      dd.x = pos.x - 1.0 + br.y;  // add left brush
      col =  mix(col, br.x, exp(brw*dot(dd,dd)));  // add 2nd brush color
    }
  }
}
//----------------------------------------------------------
void main()
{
  initData();
  vec2 pos = 3.0*gl_FragCoord.xy / resolution.y-1.0;
  pos.x -=  1.0*(resolution.x / resolution.y - 1.0);
  brush(pos);
  gl_FragColor = vec4(col,col,col,1.0);
}
