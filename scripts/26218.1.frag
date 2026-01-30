#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
vec3 color;

float circle(vec2 pos, vec2 center, float radius)
{
	return pow(pos.x-center.x, 2.0) + pow(pos.y-center.y, 2.0) <= radius*radius ? 1.0 : 0.0;
}

float rectangle (vec2 pos, vec2 center, vec2 extents) {
	return ((pos.x>center.x-extents.x)&&(pos.x<center.x+extents.x)&&(pos.y>center.y-extents.y)&&(pos.y<center.y+extents.y))?1.0:0.0;
}


float capsule (vec2 pos, vec2 center, float height, float radius) {
	return ((rectangle(pos, center, vec2(radius, height/2.0))>0.0)||(circle(pos, center+vec2(0.0, height/2.0), radius)>0.0)||(circle(pos, center+vec2(0.0, -height/2.0), radius)>0.0))?1.0:0.0;
}

vec2 rotate (vec2 v, float angle) {
	return vec2(v.x * cos(angle) - v.y * tan(angle), v.x * sin(angle) + v.y * cos(angle)); 	
}


vec3 draw(float val, vec3 s, vec3 color)
{
	return val>0.0?color:s;
}

void main( void ) {

	vec2 position = (gl_FragCoord.xy / resolution.xy) - vec2(0.5, 0.5); position.x *= resolution.x/resolution.y; position*=0.8; position.y -= 0.1;
	
	color = vec3(0, 0, 0);
	position.x += 0.02;
	
	//text
	color = draw(rectangle(position, vec2(-0.3, -0.25), vec2(0.06, 0.01)), color, vec3(0.352, 0.552, 0.243));
	color = draw(rectangle(position, vec2(-0.35, -0.35), vec2(0.01, 0.1)), color, vec3(0.352, 0.552, 0.243));
	color = draw(rectangle(position, vec2(-0.3, -0.35), vec2(0.06, 0.01)), color, vec3(0.352, 0.552, 0.243));
	color = draw(rectangle(position, vec2(-0.25, -0.3), vec2(0.01, 0.05)), color, vec3(0.352, 0.552, 0.243));
	
	color = draw(rectangle(position, vec2(-0.13, -0.35), vec2(0.01, 0.1)), color, vec3(0.352, 0.552, 0.243));
	color = draw(rectangle(position, vec2(-0.08, -0.25), vec2(0.06, 0.01)), color, vec3(0.352, 0.552, 0.243));
	color = draw(rectangle(position, vec2(-0.08, -0.34), vec2(0.06, 0.01)), color, vec3(0.352, 0.552, 0.243));
	color = draw(rectangle(position, vec2(-0.08, -0.44), vec2(0.06, 0.01)), color, vec3(0.352, 0.552, 0.243));
	
	color = draw(rectangle(position, vec2(0.15, -0.25), vec2(0.06, 0.01)), color, vec3(0.352, 0.552, 0.243));
	color = draw(rectangle(position, vec2(0.1, -0.35), vec2(0.01, 0.1)), color, vec3(0.352, 0.552, 0.243));
	color = draw(rectangle(position, vec2(0.15, -0.35), vec2(0.06, 0.01)), color, vec3(0.352, 0.552, 0.243));
	color = draw(rectangle(position, vec2(0.2, -0.3), vec2(0.01, 0.05)), color, vec3(0.352, 0.552, 0.243));
	
	color = draw(rectangle(position, vec2(0.32, -0.35), vec2(0.01, 0.1)), color, vec3(0.352, 0.552, 0.243));
	color = draw(rectangle(position, vec2(0.37, -0.25), vec2(0.06, 0.01)), color, vec3(0.352, 0.552, 0.243));
	color = draw(rectangle(position, vec2(0.37, -0.34), vec2(0.06, 0.01)), color, vec3(0.352, 0.552, 0.243));
	color = draw(rectangle(position, vec2(0.37, -0.44), vec2(0.06, 0.01)), color, vec3(0.352, 0.552, 0.243));
	position.x -= 0.1;
	position = rotate(position, tan(time*0.1)*10.1);
	
	color = draw(circle(position, vec2(0.0, 0.0), 1.0), color, vec3(0.352, 0.552, 0.243)); // head
	color = draw(circle(position, vec2(0.07, -0.04), 0.15), color, vec3(0.352, 0.552, 0.243)); // head 1
	color = draw(circle(position, vec2(0.12, -0.06), 0.11), color, vec3(0.352, 0.552, 0.243)); // head 1
	color = draw(circle(position, vec2(0.03, -0.05), 0.15), color, vec3(0.352, 0.552, 0.243)); // head 2
	
	color = draw(circle(position, vec2(0.0, 0.15), 0.1), color, vec3(0.352, 0.552, 0.243)); // eye1
	color = draw(circle(position, vec2(0.1, 0.15), 0.1), color, vec3(0.352, 0.552, 0.243)); // eye2
	color = draw(circle(position, vec2(0.17, 0.08), 0.08), color, vec3(0.352, 0.552, 0.243)); // eye2
	
	color = draw(circle(position, vec2(0.17, 0.08), 0.07), color, vec3(1.0, 1.0, 1.0)); // eye2
	color = draw(circle(position, vec2(0.02, 0.08), 0.07), color, vec3(1.0, 1.0, 1.0)); // eye1
	
	vec2 m = mouse - vec2(0.5, 0.0);
	
	vec2 eyepos1 = vec2(0.17, 0.06) + m*0.04;
	vec2 eyepos2 = vec2(0.02, 0.06) + m*0.04;
	
	color = draw(circle(position, eyepos2, 0.04), color, vec3(0.0, 0.0, 0.0)); // eye2
	color = draw(circle(position, eyepos1, 0.04), color, vec3(0.0, 0.0, 0.0)); // eye1
	
	color = draw(circle(position, eyepos2 + vec2(0.015, 0.01), 0.01), color, vec3(1.0, 1.0, 1.0)); // eye2
	color = draw(circle(position, eyepos1 + vec2(0.015, 0.01), 0.01), color, vec3(1.0, 1.0, 1.0)); // eye1
	
	color = draw(circle(position, eyepos2 + vec2(-0.015, -0.01), 0.003), color, vec3(1.0, 1.0, 1.0)); // eye2
	color = draw(circle(position, eyepos1 + vec2(-0.015, -0.01), 0.003), color, vec3(1.0, 1.0, 1.0)); // eye1
	
	color = draw(capsule(rotate(position, 1.4), rotate(vec2(0.20, -0.06), 1.4), 0.05, 0.015), color, vec3(0.647, 0.356, 0.211)); // lips
	color = draw(capsule(rotate(position, 1.5), rotate(vec2(0.15, -0.065), 1.5), 0.05, 0.015), color, vec3(0.647, 0.356, 0.211)); // lips
	color = draw(capsule(rotate(position, 1.6), rotate(vec2(0.09, -0.065), 1.6), 0.05, 0.015), color, vec3(0.647, 0.356, 0.211)); // lips
	color = draw(capsule(rotate(position, 1.7), rotate(vec2(0.03, -0.06), 1.7), 0.05, 0.015), color, vec3(0.647, 0.356, 0.211)); // lips
	color = draw(capsule(rotate(position, 1.8), rotate(vec2(-0.03, -0.05), 1.8), 0.05, 0.015), color, vec3(0.647, 0.356, 0.211)); // lips
	color = draw(capsule(rotate(position, 1.9), rotate(vec2(-0.08, -0.035), 1.9), 0.05, 0.015), color, vec3(0.647, 0.356, 0.211)); // lips
	
	color = draw(capsule(rotate(position, 1.5), rotate(vec2(0.20, -0.085), 1.5), 0.05, 0.015), color, vec3(0.647, 0.356, 0.211)); // lips
	color = draw(capsule(rotate(position, 1.5), rotate(vec2(0.15, -0.09), 1.5), 0.05, 0.015), color, vec3(0.647, 0.356, 0.211)); // lips
	color = draw(capsule(rotate(position, 1.6), rotate(vec2(0.09, -0.09), 1.6), 0.05, 0.015), color, vec3(0.647, 0.356, 0.211)); // lips
	color = draw(capsule(rotate(position, 1.7), rotate(vec2(0.03, -0.085), 1.7), 0.05, 0.015), color, vec3(0.647, 0.356, 0.211)); // lips
	color = draw(capsule(rotate(position, 1.8), rotate(vec2(-0.03, -0.075), 1.8), 0.05, 0.015), color, vec3(0.647, 0.356, 0.211)); // lips
	color = draw(capsule(rotate(position, 1.9), rotate(vec2(-0.08, -0.06), 1.9), 0.05, 0.015), color, vec3(0.647, 0.356, 0.211)); // lips
	
	color = draw(rectangle(rotate(position, -0.5), rotate(vec2(-0.02, 0.12), -0.5), vec2(0.05, 0.02)), color, vec3(0.352, 0.552, 0.243)); // eyelids
	color = draw(rectangle(rotate(position, -0.1), rotate(vec2(0.018, 0.13), -0.1), vec2(0.02, 0.02)), color, vec3(0.352, 0.552, 0.243)); // eyelids
	color = draw(rectangle(rotate(position, 0.2), rotate(vec2(0.05, 0.13), 0.2), vec2(0.02, 0.02)), color, vec3(0.352, 0.552, 0.243)); // eyelids
	color = draw(rectangle(rotate(position, 0.4), rotate(vec2(0.08, 0.12), 0.4), vec2(0.02, 0.02)), color, vec3(0.352, 0.552, 0.243)); // eyelids
	
	color = draw(rectangle(rotate(position, -0.5), rotate(vec2(0.121, 0.12), -0.5), vec2(0.04, 0.02)), color, vec3(0.352, 0.552, 0.243)); // eyelids
	color = draw(rectangle(rotate(position, -0.1), rotate(vec2(0.168, 0.131), -0.1), vec2(0.03, 0.02)), color, vec3(0.352, 0.552, 0.243)); // eyelids
	color = draw(rectangle(rotate(position, 0.2), rotate(vec2(0.2, 0.131), 0.2), vec2(0.01, 0.019)), color, vec3(0.352, 0.552, 0.243)); // eyelids
	color = draw(rectangle(rotate(position, 0.2), rotate(vec2(0.21, 0.125), 0.2), vec2(0.01, 0.015)), color, vec3(0.352, 0.552, 0.243)); // eyelids
	color = draw(rectangle(rotate(position, 0.3), rotate(vec2(0.225, 0.117), 0.3), vec2(0.01, 0.01)), color, vec3(0.352, 0.552, 0.243)); // eyelids
	color = draw(rectangle(rotate(position, 0.3), rotate(vec2(0.228, 0.112), 0.3), vec2(0.011, 0.007)), color, vec3(0.352, 0.552, 0.243)); // eyelids
	
	
	
	gl_FragColor = vec4(color, 1.0 );

}