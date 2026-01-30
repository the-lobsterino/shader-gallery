uniform sampler2D Origin;
uniform vec2 Resolution;

uniform vec3 LigthSrc;

void main()
{
	float tDist = length(gl_FragCoord - vec2(LigthSrc.x,Resolution.y - LigthSrc.y));
	float tOp = (tDist < LigthSrc.z)? cos((tDist / LigthSrc.z) * 1.570795) : 0.0f;
	
	float kernelSize = (1 - tOp) * 10;
	int mean = kernelSize/2;
	float sigma = tOp * 20;
	
	vec3 tColor(0.0);
	float sum = 0.0f;
	for(int i = 0;i<=kernelSize;i++)
	{
		for(int j = 0;j<=kernelSize;j++)
		{
			vec2 position = vec2((gl_FragCoord.x + i - mean)  / Resolution.x ,(gl_FragCoord.y + j - mean) / Resolution.y );
			float kernelValue = exp(-0.5 * (pow((i - mean) / sigma, 2.0) + pow((j - mean) / sigma, 2.0))) / (2 * 3.1415 * sigma * sigma);
			tColor += texture(Origin,position).rgb * kernelValue;
			
			sum += kernelValue;
		}
	}
	
	tColor /= sum;
	
	gl_FragColor = vec4( tColor * tOp , 1.0);

}