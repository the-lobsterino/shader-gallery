#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable



#define PI 3.14159265

uniform float time;
uniform vec2 resolution;

float angle(vec2 v)  { return atan(v.y,v.x); }

void main()
{
    vec2 center1 = resolution.xy / 2.0 -vec2(150.0,0.0);
    vec2 dist1 = center1 - gl_FragCoord.xy;

    vec2 center2 = resolution.xy / 2.0 ;
    vec2 dist2 = center2 - gl_FragCoord.xy;

    vec2 center3 = resolution.xy / 2.0 +vec2(150.0,0.0);
    vec2 dist3 = center3 - gl_FragCoord.xy;
    
    vec4 outColor = vec4(0.0,0.0,0.0,0.0);
	
    for(float i = 1.0; i<10.0; i++)
    {
	float color1 = pow(abs(dist1.x+dist1.y) + abs(dist1.y-dist1.x),0.5) - 10.0 + 0.5*sin(time*0.1*i + PI*0.1*i);
	
	outColor += vec4( smoothstep(1.0, 0.0, color1))*0.1;
	    
	if(abs(dist2.x+dist2.y) + abs(dist2.y-dist2.x) < 120.0  ) 
		color1 = pow(abs(abs(dist2.x+dist2.y) - abs(dist2.y-dist2.x)),0.5) - 6.7 + 0.5*sin(time*0.1*i + PI*0.1*i);
	else 
	        color1 = 1.0;
	outColor += vec4( smoothstep(1.0, 0.0, color1))*0.1;
	    
	color1 = pow(dist3.x*dist3.x + dist3.y*dist3.y,0.5)/10.0 - 5.5 + 0.5*sin(time*0.1*i + PI*0.1*i);
	
	outColor += vec4( smoothstep(1.0, 0.0, color1))*0.1;
    }
	    
    gl_FragColor = outColor; 
    
}