precision mediump float;


uniform float time;
uniform vec2 resolution;

vec2 rotate (vec2 pos, float angle)
{
	float c = cos(angle);
	float s = sin(angle);
	return mat2 (c, s, -s, c) * pos; // matrice de rotation 2d
}

float plane (vec3 pos)
{
	return pos.y; // plane en y=0
}

float sphere (vec3 pos, float radius)
{
	return length(pos) - radius; // sphere sur l'origine
}

float box (vec3 pos, vec3 size)
{
	return length(max(abs(pos) - size, 0.0));
}

float roundedbox (vec3 pos, vec3 size, float radius)
{
	return length(max(abs(pos) - size, 0.0)) - radius; // mix de la formule de la box + formule de la sphere
}

float map (vec3 pos)
{
	float planeDist = plane(pos);
	pos.x = abs(pos.x); // symetrie de l'espace
	pos.xy = rotate(pos.xy, pos.z * sin(time)*0.005); // on fait tourner l'espace du raymarching
	pos = mod(pos+10.0, 20.0) - 10.0; // modulo pour dupliquer la box
	pos.xy = rotate(pos.xy, time);
	pos.xz = rotate(pos.xz, time); // on fait tourner le cube sur lui meme
	
    return min(planeDist, roundedbox (pos, vec3(2.0), 2.0)); // si max, on affiche d'intersection des figures
}

vec3 albedo (vec3 pos) // on définit un shader
{
	pos *= 0.2;
	
	float f = smoothstep (0.5, 0.53, fract (pos.z)); // au-dessous de 0.5 on assigne la valeur 0, au-dessus de 0.53 on assigne la valeur donné dans return, pour la variable fract(pos.x) (comprise entre 0 et 1)
	//return fract(pos.x) * fract(pos.z) * vec3(0.0,1.0,0.0);
	return f * vec3 (0.0,1.0,1.0);
}

void main(void) 
{

	vec2 uv = -1.0 + 2.0* (gl_FragCoord.xy / resolution.xy);
	uv.x *= resolution.x / resolution.y; // correct the aspect ratio
	vec3 pos = vec3 (sin(time * 0.2) *4.0 , 5.0 + sin(time *0.3), -10.0); // position cam
	vec3 dir = normalize (vec3 (uv, 1.0)); // direction cam
	
	vec3 color = vec3(0.0);
   
	for (int i=0; i<100; i++)
   	 {
		float d = map(pos);
		if (d < 0.01) // si la distance devient très petite donc si on est a une intersection
		{
		    color = albedo(pos);
		    break;
		}
		 
		pos += d * dir; // on avance le long du rayon
   	 }

	gl_FragColor = vec4(color, 1.0);
}