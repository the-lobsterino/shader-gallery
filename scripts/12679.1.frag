#ifdef GL_ES
precision mediump float;
#endif
//Singularity Studios Pernal Noise Fire!

uniform float time;
//uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

// Recurring modulated hash based on coordinates. Returns x in [0.0; 1.0)
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898, 78.233)))*43748.5453);
}

// Cosine interpolation for scalars
float cerp(float a, float b, float i) {
	if (i < 0.0) i += 1.0; // cerp(i = -0.2) == cerp(i = 0.8)
	i = (1.0 - cos(i * 3.14159265)) / 2.0; //[0.0; 1.0] -> [0.0; PI] -cos-> [1.0; -1.0] -> [0.0; 2.0] -> [0.0; 1.0]; 
	return a * (1.0 - i) + b * i;
}

// Linear interpolation for scalarsd
float lerp(float a, float b, float i) {
	if (i < 0.0) i += 1.0; // lerp(i = -0.2) == lerp(i = 0.8)dasd
	return a * (1.0 - i) + b * i;
}

// Linear interpolation for vectors
vec3 lerp(vec3 a, vec3 b, float i) {
	if (i < 0.0) i += 1.0; // lerp(i = -0.1) == lerp(i = 0.8)
	return a * (1.0 - i) + b * i;
}

// Get random relative to bounding rectangle
float posrand(vec2 pos, float width, float height) {
	return rand( vec2(int(pos.x * width), int(pos.y * height)) );
}

// Return a value in [0.0; 1.0).
// It is a function of the relative position of the fragment.
// Introduces noise by using the pseudo-random hash generated rand() function recursively.
float tdposrandY(vec2 pos, float width, float height)
{
	float n1, n2, n3, n4, n5, n6; // All in [0.0; 1.0)
	// Grab 4 random numbers based on position + noise
	n1 = posrand(pos, width, height);
	n2 = posrand(vec2(pos.x + 1.0 / width, pos.y), width, height);
	n3 = posrand(vec2(pos.x, pos.y + 1.0 / height), width, height);
	n4 = posrand(vec2(pos.x + 1.0 / width, pos.y + 1.0 / height), width, height);
	// Interpolate them by pairs, using the cosine interpolation, based on the fractionary part of pos.x * width? 
	n5 = cerp(n1, n2, pos.x * width - float(int(pos.x * width)));
	n6 = cerp(n3, n4, pos.x * width - float(int(pos.x * width)));
	// Interpolate the resulting pair again using the cosine interpolation, based on the fract part of pos.y * height?
	return cerp(n5, n6, pos.y * height - float(int(pos.y * height)));
}

// Return a value in [0.0; 1.0).
// It is a function of the relative position of the fragment.
// Introduces noise by using the pseudo-random hash generated rand() function recursively.
float tdposrandX(vec2 pos, float width, float height)
{
	float n1, n2, n3, n4, n5, n6; // All in [0.0; 1.0)
	// Grab 4 random numbers based on position + noise
	n1 = posrand(pos, width, height);
	n2 = posrand(vec2(pos.x + 1.0 / width, pos.y), width, height);
	n3 = posrand(vec2(pos.x, pos.y + 1.0 / height), width, height);
	n4 = posrand(vec2(pos.x + 1.0 / width, pos.y + 1.0 / height), width, height);
	// Interpolate them by pairs, using the cosine interpolation, based on the fractionary part of pos.x * width? 
	n5 = cerp(n1, n2, pos.x * width - float(int(pos.x * width)));
	n6 = cerp(n3, n4, pos.x * width - float(int(pos.x * width)));
	// Interpolate the resulting pair again using the cosine interpolation, based on the fract part of pos.y * height?
	return cerp(n5, n6, pos.y * height - float(int(pos.y * height)));
}


// Get the color interpolation
vec3 readcolpath(vec3 one, vec3 two, vec3 thr, vec3 fou, float i)
{
	int num = int(i * 3.0); // [0.0; 1.0] -> [0.0; 3.0] -> floor
	if(num==0)
		return lerp(one, two, i * 3.0 - float(num));
	if(num==1)
		return lerp(two, thr, i * 3.0 - float(num));
	if(num==2)
		return lerp(thr, fou, i * 3.0 - float(num));
	return fou;
}

void main ( void ) {
	float scale = 5.0;
	vec2 position = surfacePosition * scale + vec2(0.0, scale / 2.0); // zoom out 10x, then move to the bottom
	float horBound = (resolution.x / resolution.y) * scale / 2.0;
	vec2 phaseX = vec2(time / 5.0, 0.0);
	vec2 phaseY = vec2(0.0, time / 5.0);
	vec3 smokeColor =	vec3(0.50, 0.00, 0.50);
	vec3 outerFireColor =	vec3(0.10, 0.70, 0.10);
	vec3 middleFireColor =	vec3(0.20, 0.40, 0.20);
	vec3 innerFireColor =	vec3(1.00, 1.00, 1.00);
	float colorX = 0.0;
	float colorY = 0.0;
	
	if (position.y > 0.0) {
		vec2 positionY = position * (1.0 + 1.0 / 12.0) +
			vec2(length(vec2(tdposrandY(position - phaseY, 2.0, 2.0),
					 tdposrandY(position * 4.3 - phaseY, 2.0, 2.0)))) / 12.0;
		colorY += tdposrandY(positionY - phaseY, 50.0, 50.0) / 8.0;
		colorY += tdposrandY(positionY - phaseY, 20.0, 20.0) / 3.0;
		colorY += tdposrandY(positionY - phaseY, 10.0, 10.0) / 2.0;
		colorY += tdposrandY(positionY - phaseY,  5.0,  5.0);
		colorY /= position.y * 1.0;
	} else {
		colorY = 16.0;
	}
	
	vec2 relPosition;
	if (position.x > - horBound && position.x <= 0.0) {
		vec2 relPosition = position + vec2(horBound, 0.0);
		relPosition = relPosition * (1.0 + 1.0 / 12.0) +
			vec2(length(vec2(tdposrandX(relPosition - phaseX, 2.0, 2.0),
					 tdposrandX(relPosition * 4.3 - phaseX, 2.0, 2.0)))) / 12.0;
		colorX += tdposrandX(relPosition - phaseX, 50.0, 50.0) / 8.0;
		colorX += tdposrandX(relPosition - phaseX, 20.0, 20.0) / 3.0;
		colorX += tdposrandX(relPosition - phaseX, 10.0, 10.0) / 2.0;
		colorX += tdposrandX(relPosition - phaseX,  5.0,  5.0);
		colorX /= relPosition.x * 1.0;
	} else if (position.x > 0.0 && position.x < horBound) {
		vec2 relPosition = vec2(horBound, 0.0) - position;
		relPosition = relPosition * (1.0 + 1.0 / 12.0) +
			vec2(length(vec2(tdposrandX(relPosition - phaseX, 2.0, 2.0),
					 tdposrandX(relPosition * 4.3 - phaseX, 2.0, 2.0)))) / 12.0;
		colorX += tdposrandX(relPosition - phaseX, 50.0, 50.0) / 8.0;
		colorX += tdposrandX(relPosition - phaseX, 20.0, 20.0) / 3.0;
		colorX += tdposrandX(relPosition - phaseX, 10.0, 10.0) / 2.0;
		colorX += tdposrandX(relPosition - phaseX,  5.0,  5.0);
		colorX /= relPosition.x * 1.0;
	} else {
		colorX = 16.0;
	}
	
	float color = 0.0;
	if (colorX > colorY)
		color = colorX;
	else
		color = colorY;

	gl_FragColor = vec4(vec3(color / 2.0) * readcolpath(smokeColor, outerFireColor, middleFireColor, innerFireColor, color / 16.0), 0.0);
}