#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 transform(vec3 position, vec3 translation, vec3 rotation, vec3 scale)
{
	mat4 translationMatrix =
		mat4(1.0, 0.0, 0.0, 0.0,
		     0.0, 1.0, 0.0, 0.0,
		     0.0, 0.0, 1.0, 0.0,
		     translation,   1.0);
	
	float cosine =
		cos(rotation.x);
	float sine =
		sin(rotation.x);
	
	mat4 rotationXMatrix =
		mat4(1.0,  0.0,    0.0,    0.0,
		     0.0,  cosine, sine,   0.0,
		     0.0, -sine,   cosine, 0.0,
		     0.0,  0.0,    0.0,    1.0);

	cosine =
		cos(rotation.y);
	sine =
		sin(rotation.y);

	mat4 rotationYMatrix =
		mat4(cosine,  0.0, -sine,   0.0,
		     0.0,     1.0,  0.0,    0.0,
		     sine,    0.0,  cosine, 0.0,
		     0.0,     0.0,  0.0,    1.0);

	cosine =
		cos(rotation.z);
	sine =
		sin(rotation.z);

	mat4 rotationZMatrix =
		mat4( cosine, sine,   0.0, 0.0,
		     -sine,   cosine, 0.0, 0.0,
		      0.0,    0.0,    1.0, 0.0,
		      0.0,    0.0,    0.0, 1.0);

	mat4 rotationMatrix =
		rotationXMatrix * rotationYMatrix * rotationZMatrix;
	
	mat4 scaleMatrix =
		mat4(scale.x, 0.0,     0.0,     0.0,
		     0.0,     scale.y, 0.0,     0.0,
		     0.0,     0.0,     scale.z, 0.0,
		     0.0,     0.0,     0.0,     1.0);

	mat4 transformationMatrix =
		translationMatrix * rotationMatrix * scaleMatrix;
	
	vec4 transformedPosition =
		transformationMatrix * vec4(position, 1.0);
	
	return transformedPosition.xyz;
}

float petalEdge(float f, float edge, float radius)
{
	return smoothstep(f, f + edge, radius);	
}

float petal(vec3 position, float radius, float width, float height, float edge, float eggness, float rounding)
{	
	eggness =
		exp(eggness * position.x);
	float value =
		pow(position.x, rounding) / width + pow(position.y, rounding) / (height * eggness);

	float mask =
		petalEdge(value, edge, radius);
	
	return mask;
}

vec4 redPetal(vec3 position, vec4 petalColor, vec4 backgroundColor)
{
	float radius =
		0.2;
	float width =
		0.6;
	float height =
		0.2;
	float edge =
		0.03;
	float eggness =
		3.0;
	float rounding =
		2.0;
	
	float mask =
		petal(position, radius, width, height, edge, eggness, rounding);
	
	return backgroundColor - mask + mask * petalColor;
}

void pedal(vec2 position)
{
	vec4 backgroundColor =
		vec4(1.0);
	vec4 petalColor =
		vec4(1.0, 0.0, 0.0, 1.0);

	vec3 firstPetalTranslation =
		vec3(-1.0, -0.5, 0.0);
	vec3 firstPetalRotation =
		vec3(0.0, 0.0, 0.0);
	vec3 firstPetalScale =
		vec3(1.0);
	vec3 firstPetalPosition =
		vec3(position, 0.0);

	firstPetalPosition =
		transform(firstPetalPosition, firstPetalTranslation, firstPetalRotation, firstPetalScale);

	vec4 firstPetalColor =
		redPetal(firstPetalPosition, petalColor, backgroundColor);

	gl_FragColor =
		firstPetalColor;
}
varying vec2 surfacePosition;
uniform vec2 surfaceSize;
uniform sampler2D backbuffer;
void main(){
	vec4 c = vec4(1);
	vec2 p = (surfacePosition)*8.;
	for(float i = 0.; i <= 1.; i += 1./64.){
		vec2 fdsa = vec2(cos(time*2.), sin(time));
		float t = sign(p.y*fdsa.y+p.x*fdsa.x)*pow(time+1e3, 0.3)/(0.07+i);
		p *= mat2(cos(t), sin(t), -sin(t), cos(t))*(1.+0.2*cos(1234.56789*i));
		pedal(p);
		c = min(c, gl_FragColor+i);
	}
	gl_FragColor = mix(c, texture2D(backbuffer, gl_FragCoord.xy/resolution), 126./128.);
}
