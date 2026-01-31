#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const int   complexity      = 20;                  // More points of color.
const float fluid_speed     = 9.0;                 // Drives speed, higher number will make it slower.
const float color_intensity = 10.2;
uniform sampler2D sTexture;
#define iResolution resolution
#define fragCoord gl_FragCoord
#define fragColor gl_FragColor
#define mainImage main
#define iTime time

#define power 1.
#define zoomOut 3.
#define rot 1.
#define iter 20.
#define huePower 0.7
#define glow 0.5
#define distortScale 0.8
#define distortPower 0.45
#define Speed 0
#define WaveSpeed 2.
#define Brightness 0.3

void mainImage( void )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = ( fragCoord.xy / iResolution.xy ) / 1.0;

	vec2 XYScale = vec2(22.,1.);
	vec2 XYMove = vec2(1.5,0.0);

    uv *= zoomOut;
	uv.xy = uv.xy * XYScale;
	uv.xy = uv.xy + XYMove;
	vec3 finalCol = vec3(1,0,0);
	float halfDistort = distortScale / 1.5;
	float distortsc2 = distortScale / distortScale + halfDistort;

	
	    vec2 p=(2.0*gl_FragCoord.xy-resolution)/max(resolution.x,resolution.y);
    for(int i=1;i<complexity;i++) {
        vec2 newp=p;
        newp.x+=2.5/float(i)*sin(float(i)*p.y+time/fluid_speed+0.9*float(i))+100.0;
        newp.y+=0.5/float(i)*sin(float(i)*p.x+time/fluid_speed+0.5*float(i+10))-100.0;
        p=newp;
    }

    vec3 col=vec3(color_intensity*tan(3.0*p.x)+color_intensity + .1,color_intensity*sin(1.0*p.y)+color_intensity + .3,sin(p.x+p.y) + 1.);

    gl_FragColor=vec4(col, 2.0);
    gl_FragColor = vec4(gl_FragColor.xyz, 1.);
	
	vec3 cola = vec3(vec3(glow,glow,glow)/sin(iTime*WaveSpeed-length(uv.yx) - uv.y));
	finalCol = vec3(col*col);
    vec3 Color = vec3(2.,1.,1.) * Brightness;
	Color = Color*Color * 1.5 + 0.5*tan(iTime+uv.xyx+vec3(1,2,4)) * huePower;

    // Output to screen
    fragColor = vec4(finalCol.rgb * cola, 1) * power;
}