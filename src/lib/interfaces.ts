export type Todo = {
	id: number; // ID unik untuk setiap todo
	text: string;
	dueDate: Date;
	status: 'Pending' | 'Completed'; // Status hanya bisa salah satu dari dua ini
};
