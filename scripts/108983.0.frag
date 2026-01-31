#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define iResolution resolution
#define fragCoord gl_FragCoord
#define fragColor gl_FragColor
#define mainImage main
#define iTime time

#define power 1.
#define zoomOut 3.
#define rot 1.
#define iter 10.
#define huePower 0.7
#define glow 0.5
#define distortScale 0.8
#define distortPower 0.45
#define Speed 11.5
#define WaveSpeed 6.
#define Brightness 0.3

void mainImage( void )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = ( fragCoord.xy / iResolution.xy ) + mouse / 10.0;

	vec2 XYScale = vec2(5.,7.);
	vec2 XYMove = vec2(22.0,0.0);

    uv *= zoomOut;
	uv.xy = uv.xy * XYScale;
	uv.xy = uv.xy + XYMove;
	vec3 finalCol = vec3(78,0,0);
	float halfDistort = distortScale / 11.5;
	float distortsc2 = distortScale / distortScale + halfDistort;
    
	for(float i = 1.0; i < iter; i++){
		uv.x += distortPower / i * sin(i * distortScale * uv.y - iTime * Speed);
		uv.y += distortPower / i * sin(i * distortsc2 * uv.x + iTime * Speed);
	}
	vec3 col = vec3(vec3(glow,glow,glow)/sin(iTime*WaveSpeed-length(uv.yx) - uv.y));
	finalCol = vec3(col);//*col);
    vec3 Color = vec3(1.,1.,1.) * Brightness;
	Color = Color*Color * 1.5 + 1.5*tan(iTime+uv.xyx+vec3(1,2,4)) * huePower;

    // Output to screen
    fragColor = vec4(finalCol.rgb * Color, 1) * power;
}