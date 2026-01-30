#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



void main( void ) {

	  vec3 LIGHTS[4];
	float t = 0.0;
	float dist = 2.0;
	LIGHTS[0] = vec3(sin(4.0+t+time)*dist,cos(3.0+t+time) * dist,dist);t++;
	LIGHTS[1] = vec3(sin(9.0+t+time)*dist,cos(5.0+t+time) * dist,dist);t++;
	LIGHTS[2] = vec3(sin(7.0+t+time)*dist,cos(7.0+t+time) * dist,dist);t++;
	LIGHTS[3] = vec3(sin(3.0+t+time)*dist,cos(3.0+t+time) * dist,dist);t++;
	
		
	vec2 fragPos = ( gl_FragCoord.xy / resolution.xy );
	float fx = resolution.x;
	if(fx < resolution.y){
		fx = resolution.y;
	}
	vec2 fixedPosition = gl_FragCoord.xy / vec2(fx);
	vec2 pixelSize = vec2(1.0) / resolution.xy;
	float centerDist = distance(fixedPosition, vec2(0.5,0.3333));
	float color = smoothstep(0.25, pixelSize.y+0.25, centerDist);
	vec3 result = vec3(0.0);
	float x = sin((fixedPosition.x - 0.5) * 3.14159);
	float y = sin((fixedPosition.y - 0.3333) * 3.14159);
	float z = cos(centerDist * 3.14159);
	float lR = 1.0;
	vec3 positionNormal = vec3(x,y,z) * (1.0-color);
	for(int i = 0; i < 4; i++){
		vec3 lightPos = LIGHTS[i];
		vec3 eye = vec3(0.0,0.0,3.0);
		float d = distance(lightPos,positionNormal);
		vec3 eyeToWorld = normalize(positionNormal-eye);
		vec3 lightDir = normalize(lightPos - positionNormal);
		float diffuse = dot(lightDir, positionNormal) * 0.5 * max(0.0,dist*0.8/d);
		float specular = max(0.0,min(1.0, dot(eyeToWorld, normalize(reflect(lightPos, positionNormal)))));
		specular = pow(specular,60.0);
		float c = diffuse + specular;
		lightPos = normalize(lightPos);
		result += vec3(c*lightPos.x,c*lightPos.y,c*lightPos.z);
	}
	gl_FragColor = vec4( result, 1.0 );

}