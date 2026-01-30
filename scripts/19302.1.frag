#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

void main()
{
	
	vec4 finalColor = vec4(0.0); 
	vec2 currentPos = ((gl_FragCoord.xy - resolution/2.0) / max(resolution.x, resolution.y)) * 50.0;
	float theta = time * 1.0;
	float level = 0.75 + ((1.0 + sin(time * 1.0))/2.0) * 0.5;
	mat2 rotationMatrix = mat2(cos(mouse.x*10.0), sin(mouse.x*10.0), -sin(mouse.x*10.0), cos(mouse.x*10.0));
	float germanos = -cos(theta);
	currentPos *= rotationMatrix *sin(theta)*cos(level);
	germanos += 0.200/(length(currentPos.x ));
	germanos += 1.913/(length(currentPos.x - currentPos.y));
        germanos += 1.913/(length(currentPos.x + currentPos.y));
	germanos += 1.913/(length( currentPos.y/2.0 + currentPos.y));
	
	float l = max(germanos * level, 0.0);
	finalColor = vec4(vec3(sin(theta), cos(theta), cos(l)) * sin(l), sin(l)); 
	gl_FragColor =  finalColor;
	
	
	
} 