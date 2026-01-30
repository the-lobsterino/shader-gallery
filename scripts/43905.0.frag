//Messing around... not optimized at all.
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float getBit(float num, float bit)
{
	return (mod(floor(floor(num) / pow(2.0, floor(bit))), 2.0));
}

float Sprite3x5(float sprite, vec2 p)
{
	return ((getBit(sprite, (2.0 - p.x) + 3.0 * p.y)) * (float(all(lessThan(p, vec2(3, 5))) && all(greaterThanEqual(p, vec2(0, 0))))));
}

int getString(int id) {
	int string[8];
	string[0] = 82;
	string[1] = 101;
	string[2] = 97;
	string[3] = 100;
	string[4] = 121;
	string[5] = 12;
	string[6] = 13;
	string[7] = 95;
    for (int i = 0; i < 8; i++) {
        if (i == id) return string[i];
    }
}

void main(void) {
	float font[128];
	font[  0] =     0.0; font[  1] =     0.0; font[  2] =     0.0; font[  3] =     0.0;
	font[  4] =     0.0; font[  5] =     0.0; font[  6] =     0.0; font[  7] =     0.0;
	font[  8] =     0.0; font[  9] =     0.0; font[ 10] =     0.0; font[ 11] =     0.0;
	font[ 12] =     0.0; font[ 13] =     0.0; font[ 14] =     0.0; font[ 15] =     0.0;
	font[ 16] =     0.0; font[ 17] =     0.0; font[ 18] =     0.0; font[ 19] =     0.0;
	font[ 20] =     0.0; font[ 21] =     0.0; font[ 22] =     0.0; font[ 23] =     0.0;
	font[ 24] =     0.0; font[ 25] =     0.0; font[ 26] =     0.0; font[ 27] =     0.0;
	font[ 28] =     0.0; font[ 29] =     0.0; font[ 30] =     0.0; font[ 31] =     0.0;
	font[ 32] =     0.0; font[ 33] =  9346.0; font[ 34] = 23040.0; font[ 35] = 24445.0;
	font[ 36] =  9906.0; font[ 37] = 21157.0; font[ 38] = 10923.0; font[ 39] =  9216.0;
	font[ 40] = 10530.0; font[ 41] =  8778.0; font[ 42] =  2728.0; font[ 43] =  1488.0;
	font[ 44] =    20.0; font[ 45] =   448.0; font[ 46] =     2.0; font[ 47] =  4772.0;
	font[ 48] = 11114.0; font[ 49] = 11415.0; font[ 50] = 25255.0; font[ 51] = 25230.0;
	font[ 52] = 23497.0; font[ 53] = 31118.0; font[ 54] = 14762.0; font[ 55] = 29257.0;
	font[ 56] = 10922.0; font[ 57] = 15049.0; font[ 58] =  1040.0; font[ 59] =  1044.0;
	font[ 60] =  5393.0; font[ 61] =  3640.0; font[ 62] = 17492.0; font[ 63] = 25218.0;
	font[ 64] = 11107.0; font[ 65] = 11245.0; font[ 66] = 27566.0; font[ 67] = 14627.0;
	font[ 68] = 27502.0; font[ 69] = 31143.0; font[ 70] = 31140.0; font[ 71] = 14698.0;
	font[ 72] = 23533.0; font[ 73] = 29847.0; font[ 74] =  4714.0; font[ 75] = 23469.0;
	font[ 76] = 18727.0; font[ 77] = 24557.0; font[ 78] = 24573.0; font[ 79] = 11114.0;
	font[ 80] = 27556.0; font[ 81] = 11131.0; font[ 82] = 27565.0; font[ 83] = 14478.0;
	font[ 84] = 29842.0; font[ 85] = 23402.0; font[ 86] = 23378.0; font[ 87] = 23549.0;
	font[ 88] = 23213.0; font[ 89] = 23186.0; font[ 90] = 29351.0; font[ 91] = 13459.0;
	font[ 92] = 18569.0; font[ 93] = 25750.0; font[ 94] = 10752.0; font[ 95] =     7.0;
	font[ 96] =  8704.0; font[ 97] =  3307.0; font[ 98] = 19822.0; font[ 99] =  1827.0;
	font[100] =  5995.0; font[101] =  1395.0; font[102] =  5330.0; font[103] =  1886.0;
	font[104] = 19821.0; font[105] =  8338.0; font[106] =  8340.0; font[107] = 19381.0;
	font[108] =  9362.0; font[109] =  3581.0; font[110] =  3437.0; font[111] =  1386.0;
	font[112] =  3444.0; font[113] =  1881.0; font[114] =  1316.0; font[115] =  1950.0;
	font[116] =  9873.0; font[117] =  2927.0; font[118] =  2938.0; font[119] =  2943.0;
	font[120] =  2709.0; font[121] =  2910.0; font[122] =  3831.0; font[123] =  5521.0;
	font[124] =  9362.0; font[125] = 17620.0; font[126] = 26112.0; font[127] =     0.0;
		
	float scale = 48.0;
	float offsetX = 1.0;
	float offsetY = 1.0;
	vec2 p = (gl_FragCoord.xy / resolution.xy) * vec2(1920, 1080) * (1.0 / scale);
	vec3 c = vec3(0.0, 0.0, 0.0);
	vec2 cpos = vec2(offsetX * 4.0, ((1080.0 * (1.0 / scale)) - 5.0) - (offsetY * 6.0));// - (5.0 * (1.0 / scale)));
	vec3 txColor = vec3(1.0);
	
	for(int i = 0; i < 8; i++)
	{
		c += txColor * Sprite3x5(font[getString(i)], floor(p - cpos));	
		cpos.x += 4.0;
		if(cpos.x > 61.0) cpos = vec2(0, cpos.y);
		if (getString(i) == 13) { cpos += vec2(-cpos.x + (offsetX * 4.0), -(offsetY * 6.0)); }
		if (i == 6) txColor = vec3(clamp(cos(time * 20.0), 0.15, 1.0));;
	}
	
	gl_FragColor = vec4(c, 1.0);
}
