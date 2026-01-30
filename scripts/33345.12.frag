precision highp float;

uniform vec2 mouse;
uniform sampler2D previousFrame;
uniform vec2 resolution;

//------------------------- Production Code

bool isAlive(vec4 cellColour) {
	return cellColour.a == 1.0;
}

bool isDead(vec4 cellColour) {
	return !isAlive(cellColour);
}


void putCellAt(vec2 position) {
	vec2 distance = gl_FragCoord.xy - position;
	bool inCell = 
		0.0 < distance.x && distance.x < 1.0 &&
		0.0 < distance.y && distance.y < 1.0;
	if (inCell) gl_FragColor = vec4(1.0); // same as vec4(1.0, 1.0, 1.0, 1.0)
}

bool cellAliveAt(vec2 position) {
	vec2 whereToCheck = position / resolution;
	vec4 cellColourToCheck = texture2D(previousFrame, whereToCheck);
	return isAlive(cellColourToCheck);	
}

int neighborsAt(vec2 position) {
	int count = 0;
	if (cellAliveAt(position + vec2(-1.0, -1.0))) count++;
	if (cellAliveAt(position + vec2( 0.0, -1.0))) count++;
	if (cellAliveAt(position + vec2( 1.0, -1.0))) count++;
	if (cellAliveAt(position + vec2(-1.0,  0.0))) count++;
	if (cellAliveAt(position + vec2( 1.0,  0.0))) count++;
	if (cellAliveAt(position + vec2(-1.0,  1.0))) count++;
	if (cellAliveAt(position + vec2( 0.0,  1.0))) count++;
	if (cellAliveAt(position + vec2( 1.0,  1.0))) count++;
	return count;
}

vec4 afterOneTick(vec2 position) {
	int neighbors = neighborsAt(position);
	bool cellShouldBeAlive =
		neighbors == 3 ||
		(neighbors == 2 && cellAliveAt(position));
	return cellShouldBeAlive ? vec4(1.0) : vec4(0.0);
}

//------------------------- Tests

void initTestData() {
	putCellAt(vec2(20.0, 10.0));

	putCellAt(vec2(29.0, 10.0));
	putCellAt(vec2(31.0, 10.0));

	putCellAt(vec2(40.0, 9.0));
	putCellAt(vec2(40.0, 11.0));

	putCellAt(vec2(50.0, 10.0));
	putCellAt(vec2(50.0, 11.0));
	putCellAt(vec2(51.0, 10.0));
	putCellAt(vec2(51.0, 11.0));

	putCellAt(vec2(59.0, 10.0));
	putCellAt(vec2(60.0, 10.0));
	putCellAt(vec2(61.0, 10.0));
}

bool canDetectWhetherACellIsAlive() {
	bool expectCellAliveAt = cellAliveAt(vec2(20.0, 10.0));
	return expectCellAliveAt;
}

bool canDetectWhetherACellIsDead() {
	return 
		!cellAliveAt(vec2(19.0, 10.0)) &&
		!cellAliveAt(vec2(21.0, 10.0)) &&
		!cellAliveAt(vec2(20.0, 11.0)) &&
		!cellAliveAt(vec2(20.0,  9.0)) &&
		!cellAliveAt(vec2(19.0,  9.0)) &&
		!cellAliveAt(vec2(19.0, 11.0)) &&
		!cellAliveAt(vec2(21.0,  9.0)) &&
		!cellAliveAt(vec2(21.0, 11.0));
}

bool noCellComesFromNowhere() {
	vec4 cell = afterOneTick(vec2(10.0, 10.0));
	return isDead(cell);
}

bool canCountNeighborsOnLeftAndRight() {
	int neighborsCount = neighborsAt(vec2(30.0, 10.0));
	return neighborsCount == 2;
}

bool canCountNeighborsOnTopRow() {
	int neighborsCount = neighborsAt(vec2(30.0, 9.0));
	return neighborsCount == 2;
}

bool canCountNeighborsOnBottomRow() {
	int neighborsCount = neighborsAt(vec2(30.0, 11.0));
	return neighborsCount == 2;
}

bool canCountVerticalNeighbors() {
	int neighborsCount = neighborsAt(vec2(40.0, 10.0));
	return neighborsCount == 2;
}

bool cellRemainsAliveWithThreeNeighbors() {
	vec4 cell = afterOneTick(vec2(50.0, 10.0));
	return isAlive(cell);
}

bool cellRemainsAliveWithTwoNeighbors() {
	vec4 cell = afterOneTick(vec2(60.0, 10.0));
	return isAlive(cell);
}

bool cellNeedsMoreThanTwoNeighborsToGetBorn() {
	vec4 cell = afterOneTick(vec2(40.0, 10.0));
	return isDead(cell);
}

//------------------------- Test Framework

void drawBar(vec4 color) {
	if(resolution.y - gl_FragCoord.y < 35.0)
		gl_FragColor = color;
}

void drawGreenBar() {
	drawBar(vec4(0.0, 1.0, 0.0, 1.0));
}

void drawRedBar() {
	drawBar(vec4(1.0, 0.0, 0.0, 1.0));
}

void clearScreen() {
	gl_FragColor = vec4(0.0);
}

void runTest(bool assertion) {
	if (assertion) drawGreenBar();
	else drawRedBar();
}

void runTestSuite() {
	clearScreen();
	initTestData();
	
	int testListSize = 10;
	int testNumber = int(
		float(testListSize) * gl_FragCoord.x / resolution.x
	);
	if (testNumber == 0) runTest(canDetectWhetherACellIsAlive());
	if (testNumber == 1) runTest(canDetectWhetherACellIsDead());
	if (testNumber == 2) runTest(noCellComesFromNowhere());
	if (testNumber == 3) runTest(canCountNeighborsOnLeftAndRight());
	if (testNumber == 4) runTest(canCountNeighborsOnTopRow());
	if (testNumber == 5) runTest(canCountNeighborsOnBottomRow());
	if (testNumber == 6) runTest(canCountVerticalNeighbors());
	if (testNumber == 7) runTest(cellRemainsAliveWithThreeNeighbors());
	if (testNumber == 8) runTest(cellRemainsAliveWithTwoNeighbors());
	if (testNumber == 9) runTest(cellNeedsMoreThanTwoNeighborsToGetBorn());
}

//------------------------- Main Entry Point

void main() {
	if (mouse.x < 0.5) runTestSuite();
	else gl_FragColor = afterOneTick(gl_FragCoord.xy);
}