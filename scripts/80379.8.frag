#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float pi = 3.14159;



/***  TEMP BG	***/

float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float worleyNoise(vec2 pointGenerator, vec2 position){
	const int nbPoint = 16;
	vec2 point[nbPoint];
	point[0] = pointGenerator;
	for(int i = 1;i<nbPoint;i++){
		point[i] = vec2(rand(point[i-1]),
				rand(vec2(cos(point[i-1].x),sin(point[i-1].y))
				    ));
	}
	
	float m_dist = 1.;  // minimum distance
	
	// Iterate through the points positions
	for (int i = 0; i < nbPoint; i++) {
		float dist = distance(position, point[i]);
		// Keep the closer distance
		m_dist = min(m_dist, dist);
	}
	
	// Draw the min distance (distance field)
	return m_dist;
}

//Modification of the worleyNoise Function to get the intersections between the "zones"
bool worleyContour(vec2 pointGenerator, vec2 position){
	const int nbPoint = 16;
	vec2 point[nbPoint];
	point[0] = pointGenerator;
	for(int i = 1;i<nbPoint;i++){
		point[i] = vec2(rand(point[i-1]),
				rand(vec2(cos(point[i-1].x),sin(point[i-1].y))
				    ));
	}
	
	float m_dist = 1.;  // minimum distance
	
	// Iterate through the points positions
	for (int i = 0; i < nbPoint; i++) {
		float dist = distance(position, point[i]);
		// Keep the closer distance
		m_dist=min(m_dist,dist);
	}
	
	float margin = 0.02;
	int count = 0;
	for (int i = 0; i < nbPoint; i++) {
		float dist = distance(position, point[i]);
		if( abs(m_dist-dist) < margin){
			count++;
		}
	}
	
	return count>1;
}

vec3 getWaterIntensity(vec2 position, float time,float horizonLineY){
	vec3 colorIntensity = vec3(0.0,0.0,0.0);
	vec3 baseColor_Water = vec3(0.05,0.64,0.94);
	vec3 lineColor_White = vec3(0.45,0.98,0.98);
	vec3 lineColor_Shadow = vec3(0.05,0.59,0.90);
	
	//Transform the position into the underwater part 
	vec2 underwaterPosition = vec2(+position.x,(1.0/horizonLineY)*position.y);
	
	//Get Intensity information and if the pixel is in one of the lines
	float intensityLayer = 2.0 * worleyNoise(vec2(0.0,0.0),underwaterPosition);
	bool whiteEdge  = worleyContour(vec2(0.0,0.0),underwaterPosition);
	bool shadowEdge = worleyContour(vec2(1.0,1.0),underwaterPosition);
	
	//Set Color Intensity
	colorIntensity = baseColor_Water + (intensityLayer * vec3(0.1,0.1,1));
	
	//Variable to smooth the lines when approaching the horizon
	float smoothing = underwaterPosition.y;
	float baseProportion = smoothing;
	float lineProportion = 1.0-smoothing;
	
	//Merge the color intensity with the lines
	if(shadowEdge){	colorIntensity = baseProportion * colorIntensity + lineProportion * lineColor_Shadow;}
	if(whiteEdge ){	colorIntensity = baseProportion * colorIntensity + lineProportion * lineColor_White ;}
	
	return colorIntensity;
}
/***	END TEMP BG	***/

vec3 getDefaultGrid(vec2 displacer){
	float sizeOfGrid = 32.0;
	vec3 rgb =vec3(0.0,0.0,0.0);
	
	if(mod(displacer.x+gl_FragCoord.x,sizeOfGrid*2.0)<sizeOfGrid ^^ mod(displacer.y+gl_FragCoord.y,sizeOfGrid*2.0)<sizeOfGrid){	rgb =vec3(1.0,0.0,1.0);}
	return rgb;
}

vec3 getIntensity(vec2 global_position,float time){
	vec2 displacer = vec2(0.0,0.0);
	vec3 rgb = getDefaultGrid(displacer);
	
	vec2 position = ( global_position / resolution.xy );
	
	rgb = getWaterIntensity(position, time,1.0+(cos(time)/pi));
	
	
	if(distance(global_position,mouse*resolution.xy)<16.0){
		//rgb = (1.0/3.0)*(rgb.xyz+rgb.yzx+rgb.zxy);
		rgb = 1.0-rgb;
	}
	
	return rgb;
}

vec3 pixelFishEye(vec2 position, float time){
	vec3 rgb = vec3(0.0,0.0,0.0);
	
	float sizeOfTile = 8.0;
	float sizeOfContour = 1.0;
	
	float modX = mod(position.x,sizeOfTile);
	float modY = mod(position.y,sizeOfTile);
	
	
	bool centerX = (0.5 < modX && modX < sizeOfTile-0.5);
	bool minX = (sizeOfContour > modX);
	bool maxX = (modX > sizeOfTile-sizeOfContour);
	
	bool centerY = (0.5 < modY && modY < sizeOfTile-0.5);
	bool minY = (sizeOfContour > modY);
	bool maxY = (modY > sizeOfTile-sizeOfContour);
	
	float principalIntensityFactor = 0.1;
	float secondaryIntensityFactor = 0.3;
	
	
	if(centerX && centerY){ //At the center
		//rgb = vec3(0.0,0.0,0.0);
		rgb = getIntensity(vec2(position.x,position.y),time);	
	
	}else if(maxX && centerY){ //The MaxX Line
		//rgb = vec3(1.0,0.0,0.0);
		rgb =   principalIntensityFactor * getIntensity(vec2(position.x,position.y),time)+
			secondaryIntensityFactor * getIntensity(vec2(position.x-1.0,position.y-1.0),time)+
			secondaryIntensityFactor * getIntensity(vec2(position.x-1.0,position.y    ),time)+
			secondaryIntensityFactor * getIntensity(vec2(position.x-1.0,position.y+1.0),time);
		
	}else if(minX && centerY){ //The MinX Line
		//rgb = vec3(0.0,1.0,0.0);
		rgb =   principalIntensityFactor * getIntensity(vec2(position.x,position.y),time)+
			secondaryIntensityFactor * getIntensity(vec2(position.x+1.0,position.y-1.0),time)+
			secondaryIntensityFactor * getIntensity(vec2(position.x+1.0,position.y    ),time)+
			secondaryIntensityFactor * getIntensity(vec2(position.x+1.0,position.y+1.0),time);
		
	}else if(centerX && maxY){ //The MaxY Line
		//rgb = vec3(0.0,0.0,1.0);
		rgb =   principalIntensityFactor * getIntensity(vec2(position.x,position.y),time)+
			secondaryIntensityFactor * getIntensity(vec2(position.x-1.0,position.y-1.0),time)+
			secondaryIntensityFactor * getIntensity(vec2(position.x    ,position.y-1.0),time)+
			secondaryIntensityFactor * getIntensity(vec2(position.x+1.0,position.y-1.0),time);
		
	}else if(centerX && minY){ //The MinY Line
		//rgb = vec3(1.0,1.0,0.0);
		rgb =   principalIntensityFactor * getIntensity(vec2(position.x,position.y),time)+
			secondaryIntensityFactor * getIntensity(vec2(position.x-1.0,position.y+1.0),time)+
			secondaryIntensityFactor * getIntensity(vec2(position.x    ,position.y+1.0),time)+
			secondaryIntensityFactor * getIntensity(vec2(position.x+1.0,position.y+1.0),time);
		
	}else if(maxX && minY){
		//rgb = vec3(1.0,0.0,1.0);
		rgb =   principalIntensityFactor * getIntensity(vec2(position.x,position.y),time)+
			secondaryIntensityFactor * getIntensity(vec2(position.x-1.0,position.y    ),time)+
			secondaryIntensityFactor * getIntensity(vec2(position.x-1.0,position.y+1.0),time)+
			secondaryIntensityFactor * getIntensity(vec2(position.x    ,position.y+1.0),time);
		
	}else if(maxX && maxY){
		//rgb = vec3(0.0,1.0,1.0);
		rgb =   principalIntensityFactor * getIntensity(vec2(position.x,position.y),time)+
			secondaryIntensityFactor * getIntensity(vec2(position.x-1.0,position.y    ),time)+
			secondaryIntensityFactor * getIntensity(vec2(position.x-1.0,position.y-1.0),time)+
			secondaryIntensityFactor * getIntensity(vec2(position.x    ,position.y-1.0),time);
		
	}else if(minX && maxY){
		//rgb = vec3(1.0,1.0,1.0);
		rgb =   principalIntensityFactor * getIntensity(vec2(position.x,position.y),time)+
			secondaryIntensityFactor * getIntensity(vec2(position.x+1.0,position.y    ),time)+
			secondaryIntensityFactor * getIntensity(vec2(position.x+1.0,position.y-1.0),time)+
			secondaryIntensityFactor * getIntensity(vec2(position.x    ,position.y-1.0),time);
		
	}else if(minX && minY){
		//rgb = vec3(0.5,0.5,1.0);
		rgb =   principalIntensityFactor * getIntensity(vec2(position.x,position.y),time)+
			secondaryIntensityFactor * getIntensity(vec2(position.x+1.0,position.y    ),time)+
			secondaryIntensityFactor * getIntensity(vec2(position.x+1.0,position.y+1.0),time)+
			secondaryIntensityFactor * getIntensity(vec2(position.x    ,position.y+1.0),time);	
	}
	return rgb;	
}

vec3 addPixelEffect(vec3 rgb, vec2 global_position, float time){
	float sizeOfTile = 16.0;
	float sizeOfContour = 2.0;
	
	float modX = mod(global_position.x,sizeOfTile);
	float modY = mod(global_position.y,sizeOfTile);
	
	bool centerX = (0.5 < modX && modX < sizeOfTile-0.5);
	bool minX = (sizeOfContour > modX);
	bool maxX = (modX > sizeOfTile-sizeOfContour);
	
	bool centerY = (0.5 < modY && modY < sizeOfTile-0.5);
	bool minY = (sizeOfContour > modY);
	bool maxY = (modY > sizeOfTile-sizeOfContour);
	
	float principalIntensityFactor = 0.1;
	
	rgb = rgb*0.8;
	float intensityModifier = 0.0;
	if(minX){
		intensityModifier -=principalIntensityFactor;
	}if(minY){
		intensityModifier -=principalIntensityFactor;
	}if(maxX){
		intensityModifier +=principalIntensityFactor;
	}if(maxY){
		intensityModifier +=principalIntensityFactor;
	}
	rgb = rgb *(1.0 + intensityModifier);
		
	return rgb;	
}


void main( void ) {

	vec3 rgb =vec3(0.0,0.0,0.0);
	
	//General variables
	float alpha = 1.0;
	alpha = 0.4;
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	float cosWave = (cos(time)/pi);
	float sinWave = (sin(time)/pi);
	
	rgb = getIntensity(gl_FragCoord.xy,time);
	rgb = pixelFishEye(gl_FragCoord.xy,time);
	//rgb = addPixelEffect(rgb,gl_FragCoord.xy,time);
	
	//Final Output
	gl_FragColor = vec4( vec3( rgb.x, rgb.y, rgb.z), alpha );
}