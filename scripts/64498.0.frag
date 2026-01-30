/*
 * Original shader from: https://www.shadertoy.com/view/3dXSD7
 */

#extension GL_OES_standard_derivatives : enable

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

int max_int(int a, int b) {
   return (a > b) ? a : b;
}

int min_int(int a, int b) {
   return (a < b) ? a : b;
}

// --------[ Original ShaderToy begins here ]---------- //
#define PI 3.141593
#define BG_COL (vec3(244, 242, 232) / 255.)
#define GRID_COL (vec3(179, 179, 255) / 255.)
#define LINE_COL (vec3(69, 67, 67) / 255.)
#define THICK .2
#define GTHICK .04

#define GDIST(X, GLINE) abs(mod(X + .5, GLINE) - .5) - GTHICK * GLINE * .1
#define GRIDLINES(GL) if (GTHICK * GL > edge) col = mix(col, GRID_COL, smoothstep(edge, 0., min(GDIST(uv.x, GL), GDIST(uv.y, GL))));

#define VALUES 140
int recaman[VALUES];

void init_recaman() {
  recaman[0] = 0;
  recaman[1] = 1;
  recaman[2] = 3;
  recaman[3] = 6;
  recaman[4] = 2;
  recaman[5] = 7;
  recaman[6] = 13;
  recaman[7] = 20;
  recaman[8] = 12;
  recaman[9] = 21;
  recaman[10] = 11;
  recaman[11] = 22;
  recaman[12] = 10;
  recaman[13] = 23;
  recaman[14] = 9;
  recaman[15] = 24;
  recaman[16] = 8;
  recaman[17] = 25;
  recaman[18] = 43;
  recaman[19] = 62;
  recaman[20] = 42;
  recaman[21] = 63;
  recaman[22] = 41;
  recaman[23] = 18;
  recaman[24] = 42;
  recaman[25] = 17;
  recaman[26] = 43;
  recaman[27] = 16;
  recaman[28] = 44;
  recaman[29] = 15;
  recaman[30] = 45;
  recaman[31] = 14;
  recaman[32] = 46;
  recaman[33] = 79;
  recaman[34] = 113;
  recaman[35] = 78;
  recaman[36] = 114;
  recaman[37] = 77;
  recaman[38] = 39;
  recaman[39] = 78;
  recaman[40] = 38;
  recaman[41] = 79;
  recaman[42] = 37;
  recaman[43] = 80;
  recaman[44] = 36;
  recaman[45] = 81;
  recaman[46] = 35;
  recaman[47] = 82;
  recaman[48] = 34;
  recaman[49] = 83;
  recaman[50] = 33;
  recaman[51] = 84;
  recaman[52] = 32;
  recaman[53] = 85;
  recaman[54] = 31;
  recaman[55] = 86;
  recaman[56] = 30;
  recaman[57] = 87;
  recaman[58] = 29;
  recaman[59] = 88;
  recaman[60] = 28;
  recaman[61] = 89;
  recaman[62] = 27;
  recaman[63] = 90;
  recaman[64] = 26;
  recaman[65] = 91;
  recaman[66] = 157;
  recaman[67] = 224;
  recaman[68] = 156;
  recaman[69] = 225;
  recaman[70] = 155;
  recaman[71] = 226;
  recaman[72] = 154;
  recaman[73] = 227;
  recaman[74] = 153;
  recaman[75] = 228;
  recaman[76] = 152;
  recaman[77] = 75;
  recaman[78] = 153;
  recaman[79] = 74;
  recaman[80] = 154;
  recaman[81] = 73;
  recaman[82] = 155;
  recaman[83] = 72;
  recaman[84] = 156;
  recaman[85] = 71;
  recaman[86] = 157;
  recaman[87] = 70;
  recaman[88] = 158;
  recaman[89] = 69;
  recaman[90] = 159;
  recaman[91] = 68;
  recaman[92] = 160;
  recaman[93] = 67;
  recaman[94] = 161;
  recaman[95] = 66;
  recaman[96] = 162;
  recaman[97] = 65;
  recaman[98] = 163;
  recaman[99] = 64;
  recaman[100] = 164;
  recaman[101] = 265;
  recaman[102] = 367;
  recaman[103] = 264;
  recaman[104] = 368;
  recaman[105] = 263;
  recaman[106] = 369;
  recaman[107] = 262;
  recaman[108] = 370;
  recaman[109] = 261;
  recaman[110] = 151;
  recaman[111] = 40;
  recaman[112] = 152;
  recaman[113] = 265;
  recaman[114] = 379;
  recaman[115] = 494;
  recaman[116] = 378;
  recaman[117] = 495;
  recaman[118] = 377;
  recaman[119] = 258;
  recaman[120] = 138;
  recaman[121] = 259;
  recaman[122] = 137;
  recaman[123] = 260;
  recaman[124] = 136;
  recaman[125] = 261;
  recaman[126] = 135;
  recaman[127] = 262;
  recaman[128] = 134;
  recaman[129] = 5;
  recaman[130] = 135;
  recaman[131] = 4;
  recaman[132] = 136;
  recaman[133] = 259;
  recaman[134] = 403;
  recaman[135] = 268;
  recaman[136] = 132;
  recaman[137] = 269;
  recaman[138] = 131;
  recaman[139] = 270;
}

float getPosition(float time)
{
    return mod(time * 3., float(VALUES - 1));
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    init_recaman();
    float t = getPosition(iTime);
    int stage = int(t) + 1;
    int maxZoom = 0, prevZoom;
	for(int i = 0; i < 200; ++i){
		if (i == stage) break;
		prevZoom = maxZoom;
        maxZoom = max_int(recaman[i + 1], maxZoom);
    }
    float zoom = max(2., float(prevZoom) + fract(t) * float(maxZoom - prevZoom));
    float edge = 1.5 * zoom / iResolution.x;
    vec2 uv = zoom * ((fragCoord - vec2(0, .5) * iResolution.xy) / iResolution.x) - THICK;
    vec3 col = BG_COL;
    float radius, r, up = -1., lineSeg, left, right;
    
	GRIDLINES(1.);
	GRIDLINES(5.);
    GRIDLINES(10.);
    GRIDLINES(20.);
    GRIDLINES(40.);
    
    for(int i = 0; i < 200; ++i){
        if (i == stage) break;
        left = float(min_int(recaman[i], recaman[i + 1]));
        right = float(max_int(recaman[i], recaman[i + 1]));
    	radius = .5*(right - left);
    	r = distance(uv, vec2(left + radius, 0.));
    	lineSeg = smoothstep(edge, 0., radius - .5*THICK - r)
        	* smoothstep(edge, 0., -(radius + .5*THICK - r))
        	* smoothstep(.5*edge, 0., -up * uv.y);
        if(i == stage - 1)
        {
            lineSeg *= smoothstep(0., -edge, (uv.x - left - radius) * sin(PI * fract(t))
                                  * (1. - 2.*step(float(recaman[i + 1]), float(recaman[i])))
                                  + up * uv.y * cos(PI * fract(t)));
        }
        col = mix(col, LINE_COL, lineSeg);
        up *= -1.;
    }
    fragColor = vec4(col, 1);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}