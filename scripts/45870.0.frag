#ifdef GL_ES
precision mediump float;
#endif
#extension GL_OES_standard_derivatives : enable

//author rafoudiablol
//////////////////////////////////////////////////////////////////////
///////////////// GAME : 	HIT THE CIRCLE
///////////////////////////////////////////////////////////////////////

// To know in the GET macros if we have to use the backup or the backbuffer
bool useBackup;

// Integer are unsigned
float MAX_INT = 100.0;

#define RESOLUTION							resolution.xy																	// resolution.yy to avoid uygly deformation
#define GET_BOOL(variableName)					(useBackup ? backup.variableName : texture2D(backbuffer, save.variableName / RESOLUTION).r == 1.0)
#define GET_VEC2(variableName)					(useBackup ? backup.variableName : texture2D(backbuffer, save.variableName / RESOLUTION).rg)
#define GET_INT(variableName)					(useBackup ? backup.variableName : texture2D(backbuffer, save.variableName / RESOLUTION).r * MAX_INT)

#define SAVE_BOOL(variableName, value)			if(floor(px.frag.x + 1.0) == (save.variableName.x ) && floor(px.frag.y + 1.0) == (save.variableName.y))  gl_FragColor = vec4(value, 0.0, 0.0, 1.0);
#define SAVE_VEC2(variableName, value)			if(floor(px.frag.x + 1.0) == (save.variableName.x ) && floor(px.frag.y + 1.0) == (save.variableName.y))  gl_FragColor = vec4((value).rg, 0.0, 1.0);
#define SAVE_INT(variableName, value)				if(floor(px.frag.x + 1.0) == (save.variableName.x ) && floor(px.frag.y + 1.0) == (save.variableName.y))  gl_FragColor = vec4(float(value) / MAX_INT, 0.0, 0.0, 1.0);

// SAVE has to offset px.frag by 1.0, only god knows why, maybe floor() issue

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

float random(float seed) {

	return fract(sin(seed) * 10000.0);
}

struct Pixel {
	vec2 frag; // Pixel position (same as gl_FragCoord)
	vec2 pos; // Pixel position normalized [0;1], can be > 1 if screen is not a square
} px;

struct Serializer { // each vec2 store the pixel position where is saved the data
	vec2 hasWon; // float
	vec2 circlePos; // vec2
	vec2 score; // int
} save = Serializer(
	vec2(1.0, 1.0), // For god knows why, we cant use pixel at x = 0.0 or y = 0.0
	vec2(2.0,1.0),
	vec2(3.0, 1.0)
);

struct Backup { // backup of data, so that in the main() all data is saved
		bool hasWon;
		vec2 circlePos;
		float score; // in reality int
} backup;


vec2 mousewrapper = mouse * resolution / RESOLUTION;
float RADIUS = 10000.; // Radius of the circle ATTENTION SMALL SIZE NOT WORKING IN LOWER RESOLUTION (1x)
vec2 getTarget();
float radius;

//#define mouse mousewrapper // Avoid collision

void Init() {
	
	// ------------- Init px
	px.frag = gl_FragCoord.xy;
	px.pos = px.frag / RESOLUTION;
}

void Save() {
	
	// If he has won, we search another circle and set hasWon to false
	
	if(GET_BOOL(hasWon)) {
		
		SAVE_BOOL(hasWon, 0.0);
		SAVE_VEC2(circlePos, vec2(random(time), random(time + 1.24)));
		SAVE_INT(score, GET_INT(score) + 1.0);
	}
	else {
		
		SAVE_BOOL(hasWon, step(distance(getTarget(), mouse), radius));
	}
}

// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

// Get the circle center position
vec2 getTarget() {
	
	return GET_VEC2(circlePos);
}

// Pretty background
vec3 drawBg() {

	return vec3(0.1, 0.1, 0.1);
}

vec3 drawScore() {
	
	vec3 color = vec3(0.0);
	
	if(px.pos.y > 0.9 && px.pos.x < GET_INT(score) * 0.01) {
		
		color += 0.1;	
	}
	
	return color;
}

// Get RGB of target of this px
vec3 drawTarget() {

	if(!GET_BOOL(hasWon)) {
		
		return vec3(step(distance(getTarget(), px.pos), radius));
	}
}

// -------------------------------------------- ENTRY POINT -----------------------------------------------------
void main( void ) {

	#if 0
	
	gl_FragColor = vec4(0.0);
	
	#else
	
	Init();
	
	useBackup  = false;
	backup = Backup(					// We backup the data because the drawing can overwrite pixels that store the data.
		GET_BOOL(hasWon),
		GET_VEC2(circlePos),
		GET_INT(score)
	);
	useBackup = true;
	
	radius = RADIUS - RADIUS * 0.01 * GET_INT(score);
	
	gl_FragColor = vec4(vec3(0.0), 1.0);
	gl_FragColor.rgb += drawBg();
	gl_FragColor.rgb += drawScore();
	gl_FragColor.rgb += drawTarget();
	
	SAVE_BOOL(hasWon, backup.hasWon ? 1.0 : 0.0);	// We restore old values inchanged first
	SAVE_VEC2(circlePos, backup.circlePos);
	SAVE_INT(score, backup.score);
	Save();
	
	#endif
}