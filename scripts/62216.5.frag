

#ifdef GL_ES
#   define mad(a,b,c) ((a)*(b)+(c))
#else
#   define mad fma
#endif
precision mediump float;

void _ResizeVector(out vec4 outVec4, in vec4 inVec4){outVec4 = inVec4;}
void _ResizeVector(out vec3 outVec3, in vec4 inVec4){outVec3 = inVec4.xyz;}
void _ResizeVector(out vec2 outVec2, in vec4 inVec4){outVec2 = inVec4.xy;}
void _ResizeVector(out float outFlt, in vec4 inVec4){outFlt = inVec4.x;}

void _ResizeVector(out vec4 outVec4, in vec3 inVec3){outVec4 = vec4(inVec3, 0.0);}
void _ResizeVector(out vec3 outVec3, in vec3 inVec3){outVec3 = inVec3;}
void _ResizeVector(out vec2 outVec2, in vec3 inVec3){outVec2 = inVec3.xy;}
void _ResizeVector(out float outFlt, in vec3 inVec3){outFlt = inVec3.x;}

void _ResizeVector(out vec4 outVec4, in vec2 inVec2){outVec4 = vec4(inVec2, 0.0, 0.0);}
void _ResizeVector(out vec3 outVec3, in vec2 inVec2){outVec3 = vec3(inVec2, 0.0);}
void _ResizeVector(out vec2 outVec2, in vec2 inVec2){outVec2 = inVec2;}
void _ResizeVector(out float outFlt, in vec2 inVec2){outFlt = inVec2.x;}

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D s0s;
uniform sampler2D t;






vec3 SpecialDither(in vec2 texcoord)
{
    vec3 palette[64];
	
	palette[0] = vec3(0.0,0.0,0.0);
	palette[1] = vec3(1,1,1);
	palette[2] = vec3(0.0,0.0,0.66666667);
	palette[3] = vec3(0.0,0.66666667,0.0);
	palette[4] = vec3(0.0,0.66666667,0.66666667);
	palette[5] = vec3(0.66666667,0.0,0.0);
	palette[6] = vec3(0.66666667,0.0,0.66666667);
	palette[7] = vec3(0.66666667,0.33333333,0.0);
	palette[8] = vec3(0.66666667,0.66666667,0.66666667);
	palette[9] = vec3(0.33333333,0.33333333,0.33333333);
	palette[10] = vec3(0.33333333,0.33333333,1.0);
	palette[11] = vec3(0.33333333,1.0,0.33333333);
	palette[12] = vec3(0.33333333,1.0,1.0);
	palette[13] = vec3(1.0,0.33333333,0.33333333);
	palette[14] = vec3(1.0,0.33333333,1.0);
	palette[15] = vec3(1.0,1.0,0.33333333);
	palette[16] = vec3(0.062745098,0.062745098,0.062745098);
	palette[17] = vec3(0.1254902,0.1254902,0.1254902);
	palette[18] = vec3(0.20784314,0.20784314,0.20784314);
	palette[19] = vec3(0.27058824,0.27058824,0.27058824);
	palette[20] = vec3(0.39607843,0.39607843,0.39607843);
	palette[21] = vec3(0.45882353,0.45882353,0.45882353);
	palette[22] = vec3(0.54117647,0.54117647,0.54117647);
	palette[23] = vec3(0.60392157,0.60392157,0.60392157);
	palette[24] = vec3(0.72941176,0.72941176,0.72941176);
	palette[25] = vec3(0.79215686,0.79215686,0.79215686);
	palette[26] = vec3(0.8745098,0.8745098,0.8745098);
	palette[27] = vec3(0.9372549,0.9372549,0.9372549);
	palette[28] = vec3(0,0,1.0);
	palette[29] = vec3(0.25490196,0.0,1.0);
	palette[30] = vec3(0.50980392,0.0,1.0);
	palette[31] = vec3(0.74509804,0.0,1.0);
	palette[32] = vec3(1.0,0,1.0);
	palette[33] = vec3(1.0,0.0,0.74509804);
	palette[34] = vec3(1.0,0.0,0.50980392);
	palette[35] = vec3(1,0,0.25490196);
	palette[36] = vec3(1.0,0,0);
	palette[37] = vec3(1.0,0.25490196,0);
	palette[38] = vec3(1.0,130/255,0);
	palette[39] = vec3(1,0.50980392,0);
	palette[40] = vec3(1,190/255,0);
	palette[41] = vec3(1,1,0);
	palette[42] = vec3(190/255,1,0);
	palette[43] = vec3(130/255,1,0);
	palette[44] = vec3(65/255,1,0);
	palette[45] = vec3(0,1,0);
	
	
    const int palletsize = 64;
    vec2 screensize = resolution.xy;
    vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	
	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;
	vec3 realcolor = vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 );


    float grid_position = fract(dot(texcoord, screensize * 0.5) + 0.25);

    float dither_shift = (0.25) * (1.0 / (pow(2.0,2.0) - 1.0));

    vec3 dither_shift_RGB = vec3(dither_shift, dither_shift, dither_shift);

    dither_shift_RGB = mix(2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position);

    realcolor.rgb += dither_shift_RGB;



 vec3 diff = color - palette[0];
 float dist = dot(diff, diff);
 float closest_dist = dist;
 vec3 closest_color = palette[0];
 for (int i = 0 ; i < palletsize ; i++)
  {
   diff = color - palette[i];

   dist = dot(diff,diff);

   if (dist < closest_dist)
   {
    closest_dist = dist;
    closest_color = palette[i];
   }
  }
 realcolor = closest_color;
 return realcolor;
}

void main()
{
    vec4 position;
    _ResizeVector(position, gl_FragCoord);
 vec3 color_818 = SpecialDither(position.xy);
	gl_FragColor = vec4(color_818.x,color_818.y,color_818.z,1.0);
}
