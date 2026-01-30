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

float redPetal(vec3 position)
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
	
	return mask;
}

vec4 blend(vec4 backgroundColor, vec4 color, float masks[10])
{
	vec4 blendedColor = backgroundColor;
	for (int i = 0; i < 10; ++i) {
		blendedColor =
			blendedColor - masks[i] + masks[i] * color;
	}
	
	return blendedColor;
}

void main()
{	
	vec2 position =
		gl_FragCoord.xy / resolution;
	position.x *=
		resolution.x / resolution.y;

	vec4 backgroundColor =
		vec4(1.0);
	vec4 petalColor =
		vec4(1.0, 0.0, 0.0, 1.0);

	vec3 firstPetalTranslation =
		vec3(-0.0, -0.5, 0.0);
	vec3 firstPetalRotation =
		vec3(0.0, 0.0, 0.0);
	vec3 firstPetalScale =
		vec3(1.0);
	vec3 firstPetalPosition =
		vec3(position, 0.0);

	firstPetalPosition =
		transform(firstPetalPosition, firstPetalTranslation, firstPetalRotation, firstPetalScale);

	float firstPetalMask =
		redPetal(firstPetalPosition);

	vec3 secondPetalTranslation =
		vec3(-1.0, -0.5, 0.0);
	vec3 secondPetalRotation =
		vec3(0.0, 0.0, 0.0);
	vec3 secondPetalScale =
		vec3(1.0, 1.0, 1.0);
	vec3 secondPetalPosition =
		vec3(position, 0.0);

	secondPetalPosition =
		transform(secondPetalPosition, secondPetalTranslation, secondPetalRotation, secondPetalScale);

	float secondPetalMask =
		redPetal(secondPetalPosition);
	
	gl_FragColor =
		backgroundColor - firstPetalMask - secondPetalMask + petalColor * (firstPetalMask + secondPetalMask);
}
