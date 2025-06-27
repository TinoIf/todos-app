<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Table from '$lib/components/ui/table/index';

	import { Checkbox } from '@/components/ui/checkbox';
	import { Label } from '@/components/ui/label';

	import CalenderIcon from '@lucide/svelte/icons/calendar';
	import {
		type DateValue,
		DateFormatter,
		getLocalTimeZone,
		CalendarDate
	} from '@internationalized/date';

	import { cn } from '@/utils';
	import { Calendar } from '$lib/components/ui/calendar';
	import * as Popover from '$lib/components/ui/popover';
	import PopoverTrigger from '@/components/ui/popover/popover-trigger.svelte';
	import PopoverContent from '@/components/ui/popover/popover-content.svelte';
	import type { Todo } from '$lib/interfaces';

	const dateFormatter = new DateFormatter('id-ID', {
		dateStyle: 'long',
		timeZone: getLocalTimeZone()
	});

	let value = $state<DateValue | undefined>();
	let contenRef = $state<HTMLDivElement | null>(null);

	let Todotext = $state<string>('');

	let Todos = $state<Todo[]>([]);

	let editingTodoId = $state<number | null>(null);

	function deleteTodo(id: number) {
		Todos = Todos.filter((todo) => todo.id !== id);
		alert(`Todo with ID ${id} has been deleted.`);
	}

	function saveTodo() {
		if (!Todotext.trim() || !value) {
			alert('Please enter a todo item and Pick a Date.');
			return;
		}

		if (editingTodoId) {
			Todos = Todos.map((todo) => {
				if (todo.id === editingTodoId) {
					return {
						...todo,
						text: Todotext,
						dueDate: value!.toDate(getLocalTimeZone())
					};
				}
				return todo;
			});
		} else {
			const newTodo: Todo = {
				id: Date.now(), // Simple ID generation
				text: Todotext,
				dueDate: value.toDate(getLocalTimeZone()),
				status: 'Pending'
			};

			Todos = [...Todos, newTodo]; // Add the new todo to the list
			console.log('New Todo:', newTodo, 'berhasil ditambahkan!');
		}

		Todotext = ''; // Clear the input after adding
		value = undefined; // Reset the date picker
		alert('Todo added successfully!');
	}

	function startEditing(todo: Todo) {
		editingTodoId = todo.id;
		Todotext = todo.text;

		const date = todo.dueDate;
		value = new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
	}

	function toggleTodoStatus(id: number) {
		Todos = Todos.map((todo) => {
			if (todo.id === id) {
				const newStatus = todo.status === 'Completed' ? 'Pending' : 'Completed';
				return { ...todo, status: newStatus };
			}
			return todo;
		});
	}
</script>

<div class="grid min-h-screen md:grid-cols-2">
	<div class="my-6 flex flex-col items-end p-24 pr-2">
		<h1 class="mb-4 flex w-full items-center justify-start text-3xl font-bold">Todo List</h1>
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-1/2">Todo</Table.Head>
					<Table.Head class="w-1/4">Status</Table.Head>
					<Table.Head class="hidden w-1/4">Actions</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each Todos as todo (todo.id)}
					<Table.Row>
						<Table.Cell>{todo.text}</Table.Cell>
						<Table.Cell>
							<div class="flex items-center space-x-2">
								<Checkbox
									id={'status-${todo.id}'}
									checked={todo.status === 'Completed'}
									onclick={() => toggleTodoStatus(todo.id)}
								></Checkbox>
								<Label for={'status-${todo.id}'} class="text-sm font-medium">
									{todo.status}
								</Label>
							</div>
						</Table.Cell>
						<Table.Cell>
							<Button variant="outline" size="sm" onclick={() => startEditing(todo)}>Edit</Button>
							<Button variant="destructive" size="sm" onclick={() => deleteTodo(todo.id)}
								>Delete</Button
							>
						</Table.Cell>
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={3} class="text-center text-muted-foreground">
							No todos available. Please add a todo.
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
	<div class=" my-6 flex flex-col p-24 pl-6">
		<div class="justify-Start flex">
			<h1 class="mb-2 flex w-full items-center justify-start text-xl font-semibold">
				Input Your List
			</h1>
		</div>
		<div class="grid grid-rows-2 md:pr-24">
			<form onsubmit={saveTodo} class="content">
				<div class="mb-4">
					<Input
						id="todo-input"
						bind:value={Todotext}
						class="w-full"
						placeholder="Enter your todo here..."
					/>
				</div>
				<div class="grid grid-cols-2 gap-4 pl-0">
					<Popover.Root>
						<PopoverTrigger
							class={cn(
								buttonVariants({ variant: 'outline', class: 'text-left font-normal' }),
								!value && 'text-muted-foreground'
							)}
						>
							<CalenderIcon class="mr-2 size-4" />
							{value ? dateFormatter.format(value.toDate(getLocalTimeZone())) : 'Pick a date'}
						</PopoverTrigger>
						<PopoverContent bind:ref={contenRef} class="w-auto p-0">
							<Calendar type="single" bind:value />
						</PopoverContent>
					</Popover.Root>
					<Button type="submit"
						>{#if editingTodoId}Update Todo{:else}Add Todo{/if}</Button
					>
				</div>
			</form>
		</div>
	</div>
</div>
